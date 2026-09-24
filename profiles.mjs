const clean = (text) => text.replace(/\*\*|`/g, '').trim();
const PROFILE_DETAIL_LABELS = [
  '한 줄 소개',
  '관심 분야',
  '요즘 배우는 것',
  '팀원들에게 보여주고 싶은 모습',
  '나를 표현하는 키워드',
  'GitHub',
];

export function parseProfile(markdown, name) {
  const source = markdown.replace(/<!--[\s\S]*?-->/g, '');
  const fields = {};
  const sections = {};
  let heading = '';

  for (const line of source.split(/\r?\n/)) {
    const title = line.match(/^#{2,3}\s+(.+)$/);
    if (title) {
      heading = title[1].trim();
      sections[heading] = [];
      continue;
    }
    const field = clean(line).match(/^-\s*([^:]+):\s*(.*)$/);
    if (field && ['프로필 카드', '등장 힌트', '인트로 이미지'].includes(heading)) {
      fields[field[1].trim()] = field[2].trim();
    } else if (heading && line.trim()) {
      const value = clean(line.replace(/^-\s*/, ''));
      if (value && !/^키워드1\s+키워드2\s+키워드3$/.test(value)) sections[heading].push(value);
    }
  }

  const value = (key) => fields[key] && !/^(확인 필요|작성 예정|미정)$/.test(fields[key]) ? fields[key] : '';
  return {
    name,
    image: value('프로필 이미지'),
    kai: value('KAI 점수'),
    mbti: value('MBTI'),
    tags: (value('Tag').match(/#[^\s#]+/g) ?? []).filter((tag) => !/^#태그\d+$/.test(tag)),
    school: value('학교'),
    schoolLogo: value('학교 로고'),
    major: value('학과'),
    keyword: value('등장 키워드'),
    intro: (sections['한 줄 소개'] ?? []).join(' '),
    sections,
  };
}

export function getHints(member) {
  return [
    { kind: 'school', text: member.school, image: member.schoolLogo },
    { kind: 'major', text: member.major },
    { kind: 'keyword', text: member.keyword },
  ].filter((hint) => hint.text);
}

export function getProfileDetails(member) {
  return PROFILE_DETAIL_LABELS
    .map((label) => ({
      label,
      values: (member.sections[label] ?? []).filter(Boolean),
    }))
    .filter(({ values }) => values.length > 0);
}

export function drawMember(remaining) {
  const index = Math.floor(Math.random() * remaining.length);
  return remaining.splice(index, 1)[0];
}
