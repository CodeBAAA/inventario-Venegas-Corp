import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function QRModal({ tool, onClose }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!tool || !canvasRef.current) return;

        const qrText = `Código: ${tool.codigo || tool.code} | Nombre: ${tool.nombre || tool.name} | Marca: ${tool.marca || tool.brand} | Ubicación: ${tool.ubicacion || tool.location}`;

        QRCode.toCanvas(canvasRef.current, qrText, {
            width: 260,
            margin: 2,
            errorCorrectionLevel: "M",
        });
    }, [tool]);

    const downloadQR = () => {
        const canvas = canvasRef.current;
        const link = document.createElement("a");

        link.download = `QR-${tool.codigo || tool.code || "herramienta"}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    if (!tool) return null;

    return (
        <div className="qr-modal-overlay">
            <div className="qr-modal-card">
                <button className="qr-modal-close" onClick={onClose}>
                    ×
                </button>

                <h2>QR de herramienta</h2>

                <p>
                    <strong>{tool.codigo || tool.code}</strong> — {tool.nombre || tool.name}
                </p>

                <canvas ref={canvasRef} />

                <button className="qr-download-btn" onClick={downloadQR}>
                    Descargar PNG
                </button>
            </div>
        </div>
    );
}