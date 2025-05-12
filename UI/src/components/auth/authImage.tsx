import React from "react";
import Image from "next/image";

interface AuthImageProps {
  imageUrl: string;
  altText?: string;
}

const AuthImage: React.FC<AuthImageProps> = ({
  imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjNvL1bpCc1TLzeHMESmYakMcPaS3yI8Yh6g&s",
  altText = "Authentication Background",
}) => {
  return (
    <div className="w-100 h-100 position-relative">
      <Image
        src={imageUrl}
        alt={altText}
        layout="fill"
        objectFit="cover"
        priority
      />
    </div>
  );
};

export default AuthImage;
