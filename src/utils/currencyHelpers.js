export function formatINR(amount) {
  if (amount === null || amount === undefined) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });
}

export function calculateNetTaxable(grossEarnings, payoutsReceived, poolDeductions) {
  return (grossEarnings || 0) + (payoutsReceived || 0) - (poolDeductions || 0);
}

export function calculatePoolContribution(deliveryCount) {
  return deliveryCount * 1; // ₹1 per delivery
}
