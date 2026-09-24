# 팀원 팩 선택 화면 시안

- 제작 방식: 내장 이미지 생성 도구
- 시안 범위: 첫 화면 1장. 실제 클릭 동작이 없는 정적 디자인 이미지입니다.
- 방향: 밝은 경기장, 정체를 숨긴 동일한 팩 3개, 개봉한 팀원 수 표시.
- 예정된 흐름: 팩 선택 후 조명이 낮아지고 팀원 등장. 세 명을 모으면 밝은 소개 화면으로 이동.
- [시안 이미지](./pack-selection-v1.png)

## 생성 프롬프트

```text
Use case: ui-mockup.
Create ONE high-fidelity desktop browser-content design reference image, horizontal 16:9 composition, 1920 by 1080 appearance. A single full-viewport interactive team-introduction pack-selection screen for a Korean three-person team, TEAM 5. Render just the website viewport, no monitor, no browser chrome, no surrounding presentation frame, no collage, no multiple screen states.

The user wants the tactile anticipation of a FIFA-style football card pack opening, with a BRIGHT default theme, real stadium space and personality. This is a game-like interactive scene. The task for this screen is directly choosing one of three anonymous sealed packs. Later, clicking a pack dims the stadium and reveals a member, but show ONLY the initial bright selection state here.

Art direction: white and warm very-light-gray stadium concrete, subtle natural daylight, crisp charcoal-black UI typography and small restrained warm brass details on the packs. A believable contemporary stadium passage opening onto a softly defocused football stadium in daylight, understated green pitch visible only far in the background. Camera faces a broad clean pale concrete presentation floor at waist height; roof beams, distant seating and real soft perspective supply spatial depth. Bright and airy, slightly warm photographic grade. Physical surfaces should look like real matte architectural material and real crimped foil packaging, with believable tiny creases and soft contact shadows. No futuristic fantasy chamber.

Composition: game scene fills the viewport. Slim unobtrusive HUD in a 68px-tall top strip, separated by a fine charcoal hairline. Left: a small circular 5 team emblem followed by the text "TEAM 5". Right: the small progress label "팀원 0 / 3". At upper left below the HUD, a modest strong black Korean heading "팀원 영입" with generous open space around it. This is not a giant marketing headline. The three physical unopened vertical foil packs dominate the middle of the screen in a spaced shallow arc, all fully visible, about 45 percent of viewport height. Similar physical dimensions and IDENTICAL front artwork on all three, no rarity differences. The center pack may be subtly closer to the viewer and hover a few pixels with a grounded shadow and fine understated charcoal selection corners, implying pointer focus but NOT a known character. The side packs angled slightly inward by perspective. Make the packs feel graspable and satisfying to rip open, not like flat rectangular website cards or floating credit cards.

Packaging design: tactile softly wrinkled matte ivory-and-silver foil with distinct sealed crimped top and bottom edges; bold restrained black diagonal athletic graphic bands framing an original large numeral "5", small text "TEAM 5" above and "MEMBER PACK" below. A small warm brass seam detail may catch the sunlight. All packs use the exact same graphic motif. No face, animal, silhouette, individual name, initials, person-specific color or identity hint anywhere. The character art is intentionally hidden inside. No fake ratings or probabilities.

Below the three packs, in an unobstructed calm safe area: a clearly readable centered Korean instruction "팩을 하나 골라주세요." in a refined medium-weight sans serif. A smaller line immediately below says "세 명의 팀원을 만나보세요." Pack bodies themselves are the clickable action; do not add a large unrelated global CTA button or a separate confirmation dialog. Include a subtle small arrow pointer near the lower-right corner of the center pack to convey selectable interaction.

Typography: clean Korean grotesk similar to Pretendard with an athletic condensed sans for English package lettering. Actual intentional hierarchy and generous spacing; short precise copy rendered exactly as quoted, no additional text. A clean designed console-game menu translated into a website. Beautifully concrete, readable, realistic enough to implement. Balanced light palette, a sense of pre-match daylight anticipation, no gloomy default scene.

Avoid: dark backgrounds, black-and-gold luxury template, purple-blue gradients, neon glow, glowing edge effects, particles, confetti, glass panels, abstract blobs, giant landing-page headline, SaaS navbar, pill badges, pricing or stats panels, bento cards, cartoon scenery, visible characters, user portraits, revealed card fronts, ornate fantasy card frames, logos from FIFA or EA or real clubs, unnecessary decorations, extra sections, section dividers, watermark.
```

