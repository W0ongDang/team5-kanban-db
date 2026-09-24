#!/usr/bin/env bash

# Synchronize one issue with a GitHub Projects (v2) single-select status.
# Required environment variables:
#   GH_TOKEN, PROJECT_OWNER, PROJECT_NUMBER, PROJECT_STATUS_FIELD

set -euo pipefail

content_id="$1"
target_status="$2"

: "${GH_TOKEN:?GH_TOKEN is required}"
: "${PROJECT_OWNER:?PROJECT_OWNER is required}"
: "${PROJECT_NUMBER:?PROJECT_NUMBER is required}"
: "${PROJECT_STATUS_FIELD:?PROJECT_STATUS_FIELD is required}"

project_query='query($owner: String!, $repo: String!, $number: Int!) {
  repository(owner: $owner, name: $repo) {
    owner {
      ... on User {
        projectV2(number: $number) {
          id
          fields(first: 100) {
            nodes {
              ... on ProjectV2SingleSelectField {
                id
                name
                options { id name }
              }
            }
          }
        }
      }
      ... on Organization {
        projectV2(number: $number) {
          id
          fields(first: 100) {
            nodes {
              ... on ProjectV2SingleSelectField {
                id
                name
                options { id name }
              }
            }
          }
        }
      }
    }
  }
}'

project_data="$(gh api graphql \
  -f query="$project_query" \
  -F owner="$PROJECT_OWNER" \
  -F repo="$GITHUB_REPOSITORY_NAME" \
  -F number="$PROJECT_NUMBER")"

project_id="$(jq -r '.data.repository.owner.projectV2.id // empty' <<<"$project_data")"
status_field_id="$(jq -r --arg name "$PROJECT_STATUS_FIELD" '
  .data.repository.owner.projectV2.fields.nodes
  | map(select(.name == $name))
  | first.id // empty
' <<<"$project_data")"
status_option_id="$(jq -r --arg field "$PROJECT_STATUS_FIELD" --arg status "$target_status" '
  .data.repository.owner.projectV2.fields.nodes
  | map(select(.name == $field))
  | first.options
  | map(select(.name == $status))
  | first.id // empty
' <<<"$project_data")"

if [[ -z "$project_id" ]]; then
  echo "Project #$PROJECT_NUMBER was not found for $PROJECT_OWNER." >&2
  exit 1
fi

if [[ -z "$status_field_id" || -z "$status_option_id" ]]; then
  echo "Could not find '$PROJECT_STATUS_FIELD' status option '$target_status'." >&2
  exit 1
fi

item_query='query($content: ID!) {
  node(id: $content) {
    ... on Issue {
      projectItems(first: 100) { nodes { id project { id } } }
    }
  }
}'

item_data="$(gh api graphql -f query="$item_query" -F content="$content_id")"
item_id="$(jq -r --arg project "$project_id" '
  .data.node.projectItems.nodes
  | map(select(.project.id == $project))
  | first.id // empty
' <<<"$item_data")"

if [[ -z "$item_id" ]]; then
  add_item_mutation='mutation($project: ID!, $content: ID!) {
    addProjectV2ItemById(input: {projectId: $project, contentId: $content}) {
      item { id }
    }
  }'
  item_id="$(gh api graphql \
    -f query="$add_item_mutation" \
    -F project="$project_id" \
    -F content="$content_id" \
    --jq '.data.addProjectV2ItemById.item.id')"
  echo "Added issue to Project #$PROJECT_NUMBER."
fi

update_status_mutation='mutation($project: ID!, $item: ID!, $field: ID!, $option: String!) {
  updateProjectV2ItemFieldValue(input: {
    projectId: $project
    itemId: $item
    fieldId: $field
    value: {singleSelectOptionId: $option}
  }) { projectV2Item { id } }
}'

gh api graphql \
  -f query="$update_status_mutation" \
  -F project="$project_id" \
  -F item="$item_id" \
  -F field="$status_field_id" \
  -f option="$status_option_id" >/dev/null

echo "Set issue project status to '$target_status'."
