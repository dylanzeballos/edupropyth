/**
 * Convierte una URL de YouTube normal a formato embed
 * @param url - URL de YouTube (watch, shorts, youtu.be, etc.)
 * @returns URL en formato embed o null si no es válida
 */
export const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;

  try {
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:[&?]|$)/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})(?:[?]|$)/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:[?]|$)/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:[?]|$)/,
      /youtube\.com\/live\/([a-zA-Z0-9_-]{11})(?:[?]|$)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        if (url.includes('/embed/')) {
          return url;
        }
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    return null;
  } catch (error) {
    console.error('Error parsing YouTube URL:', error);
    return null;
  }
};

/**
 * Convierte una URL de Vimeo normal a formato embed
 * @param url - URL de Vimeo
 * @returns URL en formato embed o null si no es válida
 */
export const getVimeoEmbedUrl = (url: string): string | null => {
  if (!url) return null;

  try {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
    return null;
  } catch (error) {
    console.error('Error parsing Vimeo URL:', error);
    return null;
  }
};

/**
 * Detecta el tipo de plataforma de video
 * @param url - URL del video
 * @returns 'youtube' | 'vimeo' | 'other'
 */
export const detectVideoProvider = (
  url: string,
): 'youtube' | 'vimeo' | 'other' => {
  if (!url) return 'other';

  if (
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('youtube-nocookie.com')
  ) {
    return 'youtube';
  }

  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }

  return 'other';
};

/**
 * Convierte cualquier URL de video a formato embed
 * @param url - URL del video
 * @returns URL en formato embed o la URL original si no se puede convertir
 */
export const getVideoEmbedUrl = (url: string): string => {
  if (!url) return '';

  const provider = detectVideoProvider(url);

  switch (provider) {
    case 'youtube':
      return getYouTubeEmbedUrl(url) || url;
    case 'vimeo':
      return getVimeoEmbedUrl(url) || url;
    default:
      return url;
  }
};

/**
 * Convierte una URL de PDF de Cloudinary a formato de visualización
 * @param url - URL del PDF en Cloudinary
 * @returns URL para visualizar en iframe
 */
export const getCloudinaryPdfUrl = (url: string): string => {
  if (!url) return '';

  if (url.includes('fl_attachment')) {
    return url.replace('fl_attachment', 'fl_attachment:false');
  }

  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/fl_attachment:false/${parts[1]}`;
  }

  return url;
};

/**
 * Convierte URLs de documentos para visualización en iframe
 * @param url - URL del documento
 * @param type - Tipo de documento (pdf, doc, etc.)
 * @returns URL optimizada para iframe
 */
export const getDocumentEmbedUrl = (url: string, type?: string): string => {
  if (!url) return '';

  if (url.includes('cloudinary.com') && url.includes('.pdf')) {
    return getCloudinaryPdfUrl(url);
  }

  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[0]}/preview`;
    }
  }

  if (url.includes('docs.google.com')) {
    return url.replace('/edit', '/preview');
  }

  if (type === 'pdf' || url.toLowerCase().endsWith('.pdf')) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }

  const officeExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
  const hasOfficeExtension = officeExtensions.some((ext) =>
    url.toLowerCase().endsWith(ext),
  );

  if (hasOfficeExtension) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  }

  return url;
};

/**
 * Valida si una URL es válida para embed
 * @param url - URL a validar
 * @returns true si es válida
 */
export const isValidEmbedUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Extrae el ID de un video de YouTube
 * @param url - URL de YouTube
 * @returns ID del video o null
 */
export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;

  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:[&?]|$)/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})(?:[?]|$)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:[?]|$)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:[?]|$)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Genera URL de thumbnail de un video de YouTube
 * @param url - URL de YouTube
 * @param quality - Calidad de la imagen ('default' | 'medium' | 'high' | 'maxres')
 * @returns URL del thumbnail
 */
export const getYouTubeThumbnail = (
  url: string,
  quality: 'default' | 'medium' | 'high' | 'maxres' = 'high',
): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault',
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};

/**
 * Formatea el tamaño de un archivo en formato legible
 * @param bytes - Tamaño en bytes
 * @returns Tamaño formateado (ej: "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Obtiene el ícono apropiado según el tipo de archivo
 * @param type - Tipo de archivo o extensión
 * @returns Nombre del ícono (para usar con lucide-react u otra librería)
 */
export const getFileIcon = (type: string): string => {
  const lowerType = type.toLowerCase();

  if (lowerType.includes('pdf')) return 'FileText';
  if (lowerType.includes('doc')) return 'FileText';
  if (lowerType.includes('xls') || lowerType.includes('sheet'))
    return 'FileSpreadsheet';
  if (lowerType.includes('ppt') || lowerType.includes('presentation'))
    return 'FilePresentation';
  if (
    lowerType.includes('image') ||
    lowerType.includes('jpg') ||
    lowerType.includes('png')
  )
    return 'FileImage';
  if (lowerType.includes('video') || lowerType.includes('mp4'))
    return 'FileVideo';
  if (lowerType.includes('audio') || lowerType.includes('mp3'))
    return 'FileAudio';
  if (lowerType.includes('zip') || lowerType.includes('rar'))
    return 'FileArchive';
  if (
    lowerType.includes('code') ||
    lowerType.includes('json') ||
    lowerType.includes('xml')
  )
    return 'FileCode';

  return 'File';
};
