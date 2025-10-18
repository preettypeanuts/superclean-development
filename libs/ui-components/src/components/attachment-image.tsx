import { Button } from "@ui-components/components/ui/button";
import { Dialog, DialogContent } from "@ui-components/components/ui/dialog";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

interface AttachmentImageProps {
  onUpload?: (file: File) => void;
  label?: string;
  className?: string;
  allowUpload?: boolean;
  src?: string;
  width?: number;
  height?: number;
  onChange?: (file: File) => void;
  onDelete?: () => void;
  readonly?: boolean
}

const useImageLoaded = (): [React.RefObject<HTMLImageElement>, boolean, () => void] => {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef() as React.RefObject<HTMLImageElement>

  const onLoad = () => {
    setLoaded(true)
  }

  useEffect(() => {
    if (ref.current && ref.current.complete) {
      onLoad()
    }
  })

  return [ref, loaded, onLoad]
}

function AttachmentImage({
  onUpload = () => { },
  label = "Upload Image",
  className = "",
  allowUpload = true,
  src = "",
  width = 200,
  height = 200,
  onChange = () => { },
  onDelete = () => { },
  readonly = false
}: AttachmentImageProps) {
  const ALLOWED_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const [imageSrc, setImageSrc] = useState<string>(src);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [ref, isLoaded, onLoad] = useImageLoaded()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Set file URI to preview image
      const fileUrl = URL.createObjectURL(file);

      // check if filesize is allowed
      if (file.size > ALLOWED_FILE_SIZE) {
        alert("Ukuran file terlalu besar. Maksimal ukuran file adalah 5MB.");
        return;
      }

      // @ts-ignore
      src = fileUrl;
      setImageSrc(fileUrl);
      onChange(file);
    }
  };

  useEffect(() => {
    setImageSrc(src);
  }, [src]);


  return (
    <>
      <div className={`relative ${className}`}>
        <div className={` group flex-1 aspect-square flex items-center relative justify-center text-gray-500 max-w-80 hover:text-gray-600 rounded-lg ${!imageSrc ? "border-2 border-dashed  border-gray-300 hover:border-gray-400" : ""}`}>
          {/* image preview */}
          {imageSrc ? (
            <div className="flex items-center justify-center h-full">
              <Image
                ref={ref}
                onLoad={onLoad}
                onError={onLoad}
                src={imageSrc}
                unoptimized
                alt={label}
                width={width}
                height={height}
                className="absolute inset-0 w-full h-full cursor-pointer aspect-square object-cover"
              />

              {/* preview hover */}
              {
                !isLoaded ? (
                  <div className="flex absolute inset-0 bg-black/30 items-center justify-center text-white text-sm font-semibold cursor-pointer">
                    <span>Loading...</span>
                  </div>
                ) : (
                  <div className="invisible group-hover:visible flex absolute inset-0 bg-black/30 items-center justify-center text-white text-sm font-semibold cursor-pointer"
                    onClick={() => setShowPreview(true)}
                  >
                    <span>Lihat Foto</span>
                    <FaEye className="ml-1" />
                  </div>
                )
              }
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center">{label}</p>

              {allowUpload && !readonly && (
                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer aspect-square"
                  onChange={handleFileChange} />
              )}
            </div>
          )}

          {/* delete button */}
          {imageSrc && isLoaded && !readonly && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -translate-y-1/2 translate-x-1/2 top-2 right-0 rounded-full bg-white border border-gray-300 hover:bg-gray-100 text-red-300 hover:text-red-500"
              onClick={() => {
                setImageSrc("");
                onDelete();
                // onUpload(null);
              }}
            >
              {/* cross icon */}
              <FaX />
            </Button>
          )}
        </div >


      </div >

      {/* preview modal */}
      {
        showPreview && (
          <Dialog open={showPreview} onOpenChange={setShowPreview} >
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <Image
                src={imageSrc}
                alt={label}
                width={width}
                height={height}
                className="w-full h-auto object-cover"
              />
            </DialogContent>
          </Dialog>
        )
      }
    </>
  );
}


AttachmentImage.displayName = "AttachmentImage";
export { AttachmentImage };
