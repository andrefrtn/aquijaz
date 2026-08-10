import { ImageUp } from "lucide-react";
import { useId, useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";

interface UploadAreaProps {
  label?: string;
  onFileSelected: (fileName: string, previewUrl: string) => void;
  error?: string;
}

export function UploadArea({ label = "Fotografia", onFileSelected, error }: UploadAreaProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);
    onFileSelected(file.name, url);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="rule-label text-muted-foreground">
        {label}
      </label>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "border border-dashed p-6 transition-colors",
          dragging ? "border-primary bg-secondary/60" : "border-border",
          error && "border-destructive",
        )}
      >
        {preview ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              src={preview}
              alt={`Pré-visualização de ${fileName ?? "fotografia enviada"}`}
              className="h-40 w-32 shrink-0 border border-border object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{fileName}</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-2 text-sm text-primary underline underline-offset-4"
              >
                Trocar fotografia
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <ImageUp size={24} className="text-sage" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Arraste uma imagem para cá ou selecione um arquivo do seu dispositivo.
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              Selecionar arquivo
            </button>
          </div>
        )}
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>
      {error ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}