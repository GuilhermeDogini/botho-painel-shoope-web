import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { PHOTO_FIXTURES } from './photoUploaderFixtures';
import { PhotoUploader, type PhotoUploadItem } from './PhotoUploader';

afterEach(cleanup);

describe('PhotoUploader', () => {
  test('mostra capa na primeira e slots livres', () => {
    render(
      <PhotoUploader
        photos={PHOTO_FIXTURES.slice(0, 2)}
        onChange={() => undefined}
        onAddFiles={() => undefined}
      />,
    );
    expect(screen.getByText('Capa')).toBeTruthy();
    expect(screen.getByText(/7 de 9 livres/i)).toBeTruthy();
  });

  test('tornar capa reordena', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const photos = PHOTO_FIXTURES.filter((p) => p.status === 'done').slice(0, 2);
    render(<PhotoUploader photos={photos} onChange={onChange} onAddFiles={() => undefined} />);

    await user.click(screen.getByRole('button', { name: 'Tornar capa' }));
    expect(onChange).toHaveBeenCalled();
    const next = onChange.mock.calls[0]![0] as PhotoUploadItem[];
    expect(next[0]!.id).toBe(photos[1]!.id);
    expect(next[1]!.id).toBe(photos[0]!.id);
  });

  test('remover dispara onChange sem a foto', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const photos = PHOTO_FIXTURES.slice(0, 2);
    render(<PhotoUploader photos={photos} onChange={onChange} onAddFiles={() => undefined} />);

    await user.click(screen.getByRole('button', { name: /Remover foto 2/i }));
    expect(onChange).toHaveBeenCalledWith([photos[0]]);
  });

  test('tentar de novo chama onRetry', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const err = PHOTO_FIXTURES.find((p) => p.status === 'error')!;
    render(
      <PhotoUploader photos={[err]} onChange={() => undefined} onAddFiles={() => undefined} onRetry={onRetry} />,
    );
    await user.click(screen.getByRole('button', { name: /Tentar de novo/i }));
    expect(onRetry).toHaveBeenCalledWith(err.id);
  });

  test('selecionar arquivo chama onAddFiles', async () => {
    const user = userEvent.setup();
    const onAddFiles = vi.fn();
    render(<PhotoUploader photos={[]} onChange={() => undefined} onAddFiles={onAddFiles} />);

    const file = new File(['x'], 'a.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);
    expect(onAddFiles).toHaveBeenCalled();
    expect(onAddFiles.mock.calls[0]![0][0]).toBe(file);
  });
});
