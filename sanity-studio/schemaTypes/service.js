export default {
  name: 'service',
  title: 'Services & Packages',
  type: 'document',
  fields: [
    {
      name: 'idCode',
      title: 'Package ID Code',
      type: 'string',
      description: 'e.g., "enhancement", "stage-1-polish" (Matches your layout keys)'
    },
    {
      name: 'title',
      title: 'Package Title',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Package Banner Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'cardDescription',
      title: 'Short Grid Card Description',
      type: 'text',
      rows: 2,
      description: 'The brief summary displayed on the main services bento grid.'
    },
    {
      name: 'overview',
      title: 'Deep-Dive Detailed Overview',
      type: 'text',
      rows: 4,
      description: 'The comprehensive paragraph detailing the technical execution.'
    },
    {
      name: 'duration',
      title: 'Service Duration Timeframe',
      type: 'string',
      description: 'e.g., 2 TO 3 DAYS'
    },
    {
      name: 'priceSm',
      title: 'Price: Small Vehicle Baseline',
      type: 'string',
      description: 'e.g., R1 200'
    },
    {
      name: 'priceLg',
      title: 'Price: Large Vehicle / SUV',
      type: 'string',
      description: 'e.g., R1 650'
    },
    {
      name: 'highlights',
      title: 'Key Service Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add individual bullet points (e.g., "✓ 60% Permanent Micro-Scratch Elimination")'
    },
    {
      name: 'processes',
      title: 'Step-by-Step Execution Sequence',
      type: 'array',
      description: 'Define the detailed chronological procedural roadmap steps.',
      of: [
        {
          type: 'object',
          name: 'processStep',
          title: 'Process Phase Step',
          fields: [
            {
              name: 'title',
              title: 'Step Phase Title',
              type: 'string',
              description: 'e.g., "01 / FOUR-STAGE DECONTAMINATION RECON"'
            },
            {
              name: 'desc',
              title: 'Technical Step Breakdown Description',
              type: 'text',
              rows: 3
            }
          ]
        }
      ]
    }
  ]
}