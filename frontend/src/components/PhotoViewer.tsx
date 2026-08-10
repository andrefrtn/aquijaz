import { Modal } from "@/components/common/Modal";
import type { Photo } from "@/types";

interface PhotoViewerProps {
  photo: Photo | null;
  onClose: () => void;
}

export function PhotoViewer({ photo, onClose }: PhotoViewerProps) {
  if (!photo) return null;

  return (
    <Modal open={Boolean(photo)} onClose={onClose} title={photo.description}>
      <div className="grid gap-0 md:grid-cols-[1.5fr_1fr]">
        <div className="bg-charcoal">
          <img src={photo.url} alt={photo.description} className="max-h-[75vh] w-full object-contain grayscale" />
        </div>
        <div className="flex flex-col gap-6 border-t border-border p-6 md:border-l md:border-t-0 md:p-8">
          <div>
            <p className="rule-label text-sage">Descrição</p>
            <p className="mt-2 text-sm leading-relaxed">{photo.description}</p>
          </div>
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="rule-label text-muted-foreground">Data aproximada</dt>
              <dd className="mt-1">{photo.approximateDate}</dd>
            </div>
            <div>
              <dt className="rule-label text-muted-foreground">Local</dt>
              <dd className="mt-1">{photo.location ?? "Não informado"}</dd>
            </div>
            <div>
              <dt className="rule-label text-muted-foreground">Autor</dt>
              <dd className="mt-1">{photo.author ?? "Autor desconhecido"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </Modal>
  );
}