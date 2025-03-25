import React from 'react';
import Link from 'next/link';

interface FooterProps {
  about?: string;
  help?: string;
  press?: string;
  api?: string;
  jobs?: string;
  privacy?: string;
  terms?: string;
  locations?: string;
  language?: string;
  metaVerified?: string;
  copyright?: string;
}

const Footer: React.FC<FooterProps> = ({
  about = 'About',
  help = 'Help',
  api = 'API',
  jobs = 'Jobs',
  privacy = 'Privacy',
  terms = 'Terms',
  locations = 'Locations',
  language = 'Language',
  metaVerified = 'Synapse Verified',
  copyright = '© 2025 Synapse from Quixxle',
}) => {
  return (
    <footer className="text-center py-12 opacity-60 text-xs">
      <div className="flex flex-wrap justify-center">
        <Link href="#" className="mx-2 no-underline">
          {about}
        </Link>
        <Link href="#" className="mx-2 no-underline">
          {help}
        </Link>
        <Link href="#" className="mx-2 no-underline">
          {api}
        </Link>
        <Link href="#" className="mx-2 no-underline">
          {jobs}
        </Link>
        <Link href="#" className="mx-2 no-underline">
          {privacy}
        </Link>
        <Link href="#" className="mx-2 no-underline">
          {terms}
        </Link>
        <Link href="#" className="mx-2 no-underline">
          {locations}
        </Link>
        <Link href="#" className="mx-2 no-underline">
          {language}
        </Link>
        <Link href="#" className="mx-2 no-underline">
          {metaVerified}
        </Link>
      </div>
      <p className="mt-2 text-foreground/60">{copyright}</p>
    </footer>
  );
};

export default Footer;