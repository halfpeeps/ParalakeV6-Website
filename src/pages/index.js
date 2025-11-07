import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    window.location.href = '/archive.html';
  }, []);

  return <p></p>;
}