import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import DialogPanel from "@UserInterface/Common/Dialog/Components/Panels/DialogPanel";
import CameraDialog from "@UserInterface/Common/Dialog/Layouts/Camera/CameraDialog";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import RoomCameraRenderer from "@UserInterface/Components/Room/Camera/RoomCameraRenderer";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { Fragment, useCallback, useRef, useState } from "react";

export type RoomCameraDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomCameraDialog({ hidden, onClose }: RoomCameraDialogProps) {
    const dialogs = useDialogs();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nextIndex = useRef<number>(0);

    const [images, setImages] = useState<string[]>([]);
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
    const [showCamera, setShowCamera] = useState(true);
    
    const handleCapture = useCallback(() => {
        if(!showCamera) {
            setShowCamera(true);

            return;
        }

        const dataUrl = canvasRef.current?.toDataURL("image/png");

        if(!dataUrl) {
            throw new Error("Could not create a data url from the canvas.");
        }

        const mutatedImages = [...images];
        
        if(mutatedImages.length < 5) {
            mutatedImages.push(dataUrl);
            setActiveImageIndex(mutatedImages.length - 1);
            setShowCamera(false);
        }
        else {
            mutatedImages[nextIndex.current] = dataUrl;
            setActiveImageIndex(nextIndex.current);
            setShowCamera(false);

            nextIndex.current++;
            nextIndex.current %= 5;
        }

        setImages(mutatedImages);
    }, [images, canvasRef, showCamera, setShowCamera, setActiveImageIndex]);

    if(hidden) {
        return null;
    }

    return (
        <CameraDialog title="Room Camera" onClose={onClose}>
            <div style={{
                width: 320,
                height: 320,

                position: "relative"
            }}>
                {(showCamera || activeImageIndex === null || !images[activeImageIndex])?(
                    <Fragment>
                        <RoomCameraRenderer canvasRef={canvasRef} width={320} height={320}/>
                
                        <div className="sprite_room_camera_viewfinder" style={{
                            position: "absolute",

                            left: 0,
                            top: 0
                        }}/>
                    </Fragment>
                ):(
                    <Fragment>
                        <img src={images[activeImageIndex]} width={320} height={320}/>

                        <FlexLayout align="center" justify="center" style={{
                            position: "absolute",

                            width: 320,

                            left: 0,
                            bottom: 0,

                            background: "rgba(0, 0, 0, .4)",
                            padding: "18px 0"
                        }}>
                            <DialogButton onClick={() => {
                                dialogs.openUniqueDialog("room-camera-editor", {
                                    image: images[activeImageIndex]
                                });
                            }}>
                                Edit picture
                            </DialogButton>
                        </FlexLayout>

                    </Fragment>
                )}

                <div className="sprite_room_camera_shadow_outline" style={{
                    position: "absolute",

                    left: 0,
                    top: 0,

                    pointerEvents: "none"
                }}/>
            </div>

            <FlexLayout align="center" justify="center">
                <div className="sprite_room_camera_button" style={{
                    cursor: "pointer"
                }} onClick={handleCapture}/>
            </FlexLayout>

            {(images.length > 0) && (
                <DialogPanel style={{
                    borderTop: "none",
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0
                }} contentStyle={{
                    borderTop: "none",
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0
                }}>
                    <FlexLayout direction="row" align="center" justify="space-between" gap={0}>
                        {Array(5).fill(null).map((_, index) => (
                            <div key={index} style={{
                                position: "relative",
                                
                                width: 62,
                                height: 62,

                                cursor: "pointer"
                            }} onClick={() => setActiveImageIndex(index)}>
                                <div style={{
                                    border: (activeImageIndex !== index)?("1px solid #000000"):("1px solid transparent"),

                                    width: 56,
                                    height: 56,

                                    position: "absolute",

                                    left: 2,
                                    top: 2
                                }}>
                                    {images[index] && (
                                        <img src={images[index]} width={56} height={56}/>
                                    )}
                                </div>

                                {(activeImageIndex === index) && (
                                    <Fragment>
                                        <div className="sprite_room_camera_photo_border" style={{
                                            position: "absolute",

                                            left: 1,
                                            top: 1
                                        }}/>

                                        {(images[index]) && (
                                            <div className="sprite_room_camera_remove" style={{
                                                position: "absolute",

                                                top: -2,
                                                right: -6,

                                                zIndex: 1,

                                                cursor: "pointer"
                                            }} onClick={() => {
                                                const mutatedImages = [...images];
                                                mutatedImages.splice(index, 1);

                                                setImages(mutatedImages);
                                                setShowCamera(true);
                                            }}/>
                                        )}
                                    </Fragment>
                                )}
                            </div>
                        ))}
                    </FlexLayout>
                </DialogPanel>
            )}
        </CameraDialog>
    );
}
