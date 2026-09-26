import { vi } from 'vitest';

const mockResponse = {
    ok: true,
    json: () => Promise.resolve({ ok: true }),
    text: () => Promise.resolve('ok:true')
};

vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse as Response));
