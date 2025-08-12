'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  quality?: number;
  sizes?: string;
  className?: string;
  onClick?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function OptimizedImage({
  src,
  alt,
  title,
  width,
  height,
  fill = false,
  priority = false,
  loading = 'lazy',
  quality = 80,
  sizes,
  className,
  onClick,
  placeholder = 'empty',
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate a simple blur placeholder if needed
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-200 text-gray-500",
          fill ? "absolute inset-0" : "",
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-sm">Image non disponible</span>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    title,
    priority,
    quality,
    sizes,
    onLoad: handleLoad,
    onError: handleError,
    className: cn(
      "transition-opacity duration-300",
      isLoading ? "opacity-0" : "opacity-100",
      className
    ),
    onClick,
    placeholder: placeholder === 'blur' ? 'blur' as const : undefined,
    blurDataURL: placeholder === 'blur' ? (blurDataURL || defaultBlurDataURL) : undefined,
    ...props
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  return <Image {...imageProps} width={width!} height={height!} />;
}