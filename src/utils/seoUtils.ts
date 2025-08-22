export const createSeoFriendlySlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
};

export const createVehicleSlug = (brand: string, model: string, year: number): string => {
  return createSeoFriendlySlug(`${brand} ${model} ${year}`);
};

export const parseVehicleSlug = (slug: string): { brand: string; model: string; year: string } => {
  const parts = slug.split('-');
  // This is a simplified parser - in production you'd want more robust parsing
  // For now, we'll assume the last part is the year if it's numeric
  const lastPart = parts[parts.length - 1];
  const isYear = /^\d{4}$/.test(lastPart);
  
  if (isYear) {
    const year = lastPart;
    const brandModel = parts.slice(0, -1).join(' ');
    // Split brand and model - this would need refinement based on your data
    const brandModelParts = brandModel.split(' ');
    const brand = brandModelParts[0] || '';
    const model = brandModelParts.slice(1).join(' ') || '';
    
    return { brand, model, year };
  }
  
  // Fallback if no year found
  const brandModel = parts.join(' ');
  const brandModelParts = brandModel.split(' ');
  const brand = brandModelParts[0] || '';
  const model = brandModelParts.slice(1).join(' ') || '';
  
  return { brand, model, year: '' };
};

export const generateVehicleMetadata = (vehicle: {
  brand: string;
  model: string;
  year: number;
  price: number;
  range_km: number;
}) => {
  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.year} - Electric Vehicle Nigeria | CARPLUTO`;
  const description = `Buy ${vehicle.brand} ${vehicle.model} ${vehicle.year} electric vehicle in Nigeria. ${vehicle.range_km}km range, ₦${vehicle.price.toLocaleString()} with financing options. CARPLUTO - Nigeria's trusted EV marketplace.`;
  
  return {
    title,
    description,
    keywords: `${vehicle.brand} Nigeria, ${vehicle.model} electric car, EV ${vehicle.year}, electric vehicles Nigeria, sustainable mobility, CARPLUTO`,
  };
};