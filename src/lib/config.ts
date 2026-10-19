import { sitePath } from './paths';
// Public configuration only. Connected Twin and lead delivery require separate implementation and QA.
export const integrations = {
  mode: 'fixture',
  viewer: { enabled: false, transport: null, url: null },
  lead: { enabled: false, endpoint: null },
  privacyUrl: null,
  analytics: { enabled: false },
} as const;

export const fixture = {
  projectId: 'example-project', buildingId: 'building-1', floorId: 'floor-4', lotId: 'lot-4-2',
  dataMode: 'EXAMPLE', commercial: null,
};
export type Selection = { projectId: string; buildingId: string | null; floorId: string | null; lotId: string | null; view: 'plan' | 'view' };
export const initialSelection: Selection = { ...fixture, view: 'plan' };

export function validateSelection(input: Partial<Selection>): Selection {
  const buildingId = input.buildingId === fixture.buildingId ? fixture.buildingId : null;
  const floorId = buildingId && input.floorId === fixture.floorId ? fixture.floorId : null;
  const lotId = floorId && input.lotId === fixture.lotId ? fixture.lotId : null;
  return { projectId: fixture.projectId, buildingId, floorId, lotId, view: input.view === 'view' ? 'view' : 'plan' };
}

export function publicSelectionUrl(path: string, selection: Selection) {
  const query = new URLSearchParams({ projectId: selection.projectId, view: selection.view });
  for (const key of ['buildingId', 'floorId', 'lotId'] as const) if (selection[key]) query.set(key, selection[key]!);
  return `${sitePath(path)}?${query}`;
}
