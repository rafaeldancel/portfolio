# Stack icon sources

SVG paths are preserved from their sources. Local SVG components use `currentColor`
for the monochrome manifest. No logo has been traced, redrawn, or approximated.

| Token | Source |
| --- | --- |
| JavaScript | Installed `@icons-pack/react-simple-icons`, `SiJavascript` |
| Python | Installed `@icons-pack/react-simple-icons`, `SiPython` |
| Claude | Installed `@icons-pack/react-simple-icons`, `SiClaude` |
| OpenAI | [OpenAI's cookbook logomark](https://github.com/openai/openai-cookbook/blob/main/examples/agents_sdk/deployment_manager/frontend/src/openai-logomark.svg), the knot/Blossom, not the Codex mark |
| Amazon Bedrock | [AWS architecture icon package](https://aws.amazon.com/architecture/icons/), `Icon-package_07312026/Architecture-Service-Icons_07312026/Arch_Artificial-Intelligence/16/Arch_Amazon-Bedrock_16.svg`; service glyph, tile background omitted |
| pgAdmin | [pgAdmin's official Lines.svg layer](https://github.com/pgadmin-org/pgadmin4/blob/master/pkg/mac/pgAdmin4.icon/Assets/Lines.svg), original outline paths |
| Auth.js | Text-only. Not in the installed Simple Icons package or Devicon catalogue. The [official repository](https://github.com/nextauthjs/next-auth/tree/main/docs/public/img) publishes `logo-sm.png`; no official brand SVG found. Unofficial tracings are excluded. |
| Codex | [Devicon codex-plain.svg](https://github.com/devicons/devicon/blob/master/icons/codex/codex-plain.svg), verified exact path match; retained |
| Antigravity | [Devicon antigravity-plain.svg](https://github.com/devicons/devicon/blob/master/icons/antigravity/antigravity-plain.svg), verified exact path match; retained |
| LinkedIn (contact button) | [Devicon linkedin-plain.svg](https://github.com/devicons/devicon/blob/master/icons/linkedin/linkedin-plain.svg), path copied verbatim. Not in the installed Simple Icons package (removed upstream at LinkedIn's request) |
| GitHub (contact button) | Installed `@icons-pack/react-simple-icons`, `SiGithub` |

The installed Simple Icons exports were checked first, then the upstream
[Devicon catalogue](https://github.com/devicons/devicon/blob/master/devicon.json),
then the brands' official sources. Existing Devicon components are covered by
`DEVICON-LICENSE.txt`. OpenAI's mark belongs to OpenAI and follows its
[brand guidelines](https://openai.com/brand/). AWS artwork follows its icon package
terms. pgAdmin's artwork is from the pgAdmin project under its
[PostgreSQL licence](https://github.com/pgadmin-org/pgadmin4/blob/master/LICENSE).
