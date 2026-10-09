<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Website architecture
- Keep the company presentation as sections on the home route; anchor navigation matches this single-page editorial experience.
- Store brand colors, typography, motion and section styling in the global design system; shared Button variants implement branded actions consistently.
- Send enquiries through a prefilled email draft rather than pretending to persist submissions; no server service is connected.
- Clearly label generated showcase imagery as illustrative concepts rather than actual client projects.
