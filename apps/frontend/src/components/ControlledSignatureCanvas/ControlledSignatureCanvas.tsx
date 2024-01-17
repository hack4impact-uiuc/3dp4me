import omit from "lodash.omit"
import { Nullish, Signature, SignaturePoint } from "@3dp4me/types";
import { FC, useEffect, useRef, useState } from "react";
import ReactSignatureCanvas from "react-signature-canvas"

interface ControlledSignatureCanvasProps {
    value: Nullish<Signature>
}

/**
 * This library doesn't work great for "controlled" canvases. So we just encapsulate it here so that
 * we can make it mount and unmout on every value update
 * @returns 
 */
export const ControlledSignatureCanvas: FC<ControlledSignatureCanvasProps> = ({ value }) => {
    // TODO: Maybe set key??
    const sigCanvas = useRef<ReactSignatureCanvas | null>(null)
    const [doesCanvasHaveData, setDoesCanvasHaveData] = useState(false)

    useEffect(() => {
        if (!value?.signatureData || !sigCanvas.current || doesCanvasHaveData) return;

        const canvas = sigCanvas.current.getCanvas()
        if (!canvas) return

        const data = transformSignatureData(
            canvas,
            value.signatureData,
            value.signatureCanvasWidth,
            value.signatureCanvasHeight,
        );

        setDoesCanvasHaveData(true)
        setImmediate(() => sigCanvas.current?.fromData(data as any))
    }, [value, sigCanvas.current, doesCanvasHaveData]);

    /**
     * Transforms the signature data so that it is able to be displayed on the canvas.
     * This includes doing some slight manipulation of the structure and scaling
     */
    const transformSignatureData = (
        canvas: HTMLCanvasElement,
        data: SignaturePoint[][],
        originalCanvasWidth: number,
        originalCanvasHeight: number,
    ) => {
        const formattedData = data.map((points) => {
            const withoutColor = points.map((point) => omit(point, 'color'));
            const firstTimestamp = withoutColor.length > 0 ? withoutColor[0].time : 0;

            const padPoints = withoutColor.map((point) => {
                const scaleFactor = canvas.width / originalCanvasWidth;
                const deltaT = point.time - firstTimestamp;

                // Scale the data points so that they fit this canvas
                const x = (point.x / originalCanvasWidth) * canvas.width
                const y = (point.y / originalCanvasHeight) * canvas.height

                // Scales the time of each touch point.... doens't work great
                const time = firstTimestamp + deltaT * scaleFactor
                return { x, y, time }
            });

            return padPoints
        });

        return formattedData;
    };

    return <ReactSignatureCanvas ref={sigCanvas}/>

}