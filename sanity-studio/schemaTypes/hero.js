export default {
  name: 'hero',
  type: 'document',
  title: 'Hero Configuration',
  fields: [
    {
      name: 'branding',
      type: 'string',
      title: 'Top Left Branding Title (e.g., Perfect Finish / Detailing)'
    },
    // {
    //   name: 'logoImage',
    //   type: 'image',
    //   title: 'Custom Brand Logo Graphic'
    // },
    {
      name: 'locationMarker',
      type: 'string',
      title: 'Location Tagline (e.g., SOWETO / GAUTENG)'
    },
    {
      name: 'mainHeading',
      type: 'string',
      title: 'Main Statement Heading (e.g., SURFACE PERFECTION. / NO SHORTCUTS.)'
    },
    {
      name: 'backgroundImage',
      type: 'image',
      title: 'Premium Background Asset Shot',
      options: { hotspot: true }
    }
  ]
}