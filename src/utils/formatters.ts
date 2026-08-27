export function formatINR(amount: number): string {
  if (Math.abs(amount) >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatINRFull(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatWeight(tons: number): string {
  return `${tons.toFixed(1)}T`;
}

export function formatVolume(m3: number): string {
  return `${m3.toFixed(1)} m³`;
}

export function formatDistance(km: number): string {
  return `${km.toLocaleString('en-IN')} km`;
}

export function formatPercentage(val: number): string {
  return `${val.toFixed(1)}%`;
}
