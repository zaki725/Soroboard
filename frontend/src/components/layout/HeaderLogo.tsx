import Link from 'next/link';
import Image from 'next/image';

export const HeaderLogo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <Image
        src="/logo.svg"
        alt="Soroboard"
        width={150}
        height={50}
        className="h-15 w-auto object-contain"
        loading="eager"
        priority
      />
    </Link>
  );
};
