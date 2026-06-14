export default {
  name: 'bookingConfig',
  title: 'Booking Form Configuration',
  type: 'document',
  fields: [
    {
      name: 'vehicleType',
      title: 'Vehicle Type',
      type: 'string',
      description: 'e.g., Hatchback, Sedan, Crossover, SUV/Bakkie'
    },
    {
      name: 'discountPercentage',
      title: 'Active Discount Percentage (%)',
      type: 'number',
      description: 'Optional: Enter a number from 1 to 100 to apply a discount to this vehicle class (e.g., 10 for 10% off). Leave blank or 0 for normal pricing.',
      validation: Rule => Rule.min(0).max(100)
    },
    {
      name: 'servicePrices',
      title: 'Service Type & Pricing Matrix',
      type: 'array',
      description: 'Add your individual service rates for this vehicle type here.',
      of: [
        {
          type: 'object',
          name: 'servicePriceItem',
          fields: [
            { name: 'serviceName', title: 'Service Name', type: 'string' },
            { name: 'flatPrice', title: 'Absolute Cost (ZAR)', type: 'number' }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'vehicleType',
      subtitle: 'discountPercentage'
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || 'Unnamed Vehicle Type',
        subtitle: subtitle ? `${subtitle}% Off Active` : 'Standard Pricing'
      };
    }
  }
}