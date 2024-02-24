"use client";
import { QRCodeCanvas } from "qrcode.react";

const QRCode = (props) => {
  return (
    <QRCodeCanvas
      value={props.url}
      size={128}
      bgColor={"#FFFFFF"}
      fgColor={"#000000"}
      level={"L"}
      includeMargin={false}
      imageSettings={{
        src: "/favicon.ico",
        x: undefined,
        y: undefined,
        height: 24,
        width: 24,
        excavate: true,
      }}
    />
  );
};

export default QRCode;
