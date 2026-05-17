# H101 — In-Panel Resource Viewer with Thumbnails

## Goal

Resources (videos and articles) in the details panel should display thumbnail previews and open inside the app in an embedded panel rather than navigating the user to an external tab.

## Files Affected

- `src/app/cat-prep/lib/youtubeUtils.ts` — new: extract YouTube video ID, thumbnail URL, embed URL
- `src/app/cat-prep/components/details/ResourceViewer.tsx` — new: embedded iframe viewer shown inside the details panel
- `src/app/cat-prep/components/details/ResourceList.tsx` — add thumbnails to cards; change anchor → button with click handler
- `src/app/cat-prep/components/details/DetailsPanel.tsx` — add `viewingResource` state; render ResourceViewer when set

## Acceptance Criteria

- [ ] Each resource card shows a thumbnail (YouTube auto-thumbnail for videos; icon placeholder for articles)
- [ ] Clicking a resource card opens the resource viewer inside the panel (not a new tab)
- [ ] ResourceViewer shows the resource title and a back button
- [ ] ResourceViewer shows an embedded iframe with the resource content
- [ ] YouTube URLs are transformed to embed URLs (`/embed/{id}`)
- [ ] An "Open in new tab" link is always visible in ResourceViewer as an escape hatch
- [ ] Edit mode is not affected — resource editing still works as before
- [ ] Back button returns to the node details view

## Test Plan

1. Open the roadmap, click a subtopic, verify resource cards show thumbnails.
2. Click a YouTube video resource — panel should switch to viewer with embedded YouTube player.
3. Click an article resource — panel should switch to viewer with embedded page (or show content if site allows).
4. Verify "Open in new tab" link is visible in the viewer and works.
5. Click "← Back" — panel should return to node details.
6. Enter edit mode — verify editing resources still works normally.
7. Test on mobile — viewer should fill the panel correctly.

## Out of Scope

- Handling X-Frame-Options blocked sites with a fallback UI (noted as future work; users can use "Open in new tab").
- Non-YouTube video hosts (Vimeo, etc.) — treated as generic iframe.
- Adding a `thumbnail` field to resources.json — thumbnails are auto-derived from URL.
