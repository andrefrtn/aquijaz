import type { Photo } from "@/types";

interface PhotoGalleryProps {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
}

export function PhotoGallery({ photos, onSelect }: PhotoGalleryProps) {
  return (
    <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>li]:mb-6">
      {photos.map((photo) => (
        <li key={photo.id} className="break-inside-avoid">
          <button
            type="button"
            onClick={() => onSelect(photo)}
            className="group block w-full text-left"
          >
            <div className="overflow-hidden border border-border bg-beige">
              <img
                src={photo.url}
                alt={photo.description}
                loading="lazy"
                className="w-full object-cover grayscale transition-opacity duration-300 group-hover:opacity-90"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {photo.approximateDate}
              {photo.location ? ` · ${photo.location}` : ""}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}