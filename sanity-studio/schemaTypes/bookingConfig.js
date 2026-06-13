export default {
  name: 'bookingConfig',
  title: 'Booking Form Configuration',
  type: 'document',
  fields: [
    {
      name: 'whatsappNumber',
      title: 'Target WhatsApp Number',
      type: 'string',
      description: 'Include international prefix with no spaces, e.g., "278XXXXXXXX" for South Africa'
    },
    {
      name: 'services',
      title: 'Service Options',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'bookingService',
          fields: [
            { name: 'name', title: 'Package Name', type: 'string' },
            { name: 'basePrice', title: 'Base Price (ZAR)', type: 'number' }
          ]
        }
      ]
    },
    {
      name: 'vehicles',
      title: 'Vehicle Types',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'bookingVehicle',
          fields: [
            { name: 'name', title: 'Vehicle Classification', type: 'string' },
            { name: 'premium', title: 'Surcharge / Premium Price (ZAR)', type: 'number' }
          ]
        }
      ]
    }
  ]
}