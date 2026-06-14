export default {
  name: 'benefitsConfig',
  title: 'Benefits Bento Layout',
  type: 'document',
  fields: [
    {
      name: 'sectionTitle',
      title: 'Section Main Title',
      type: 'string',
      initialValue: 'The Benefits'
    },
    {
      name: 'sectionSubtitle',
      title: 'Section Subtitle',
      type: 'text',
      rows: 2
    },
    {
      name: 'card1',
      title: 'Slot 1: Left Tall Card (e.g., Swirl-Free)',
      type: 'object',
      fields: [
        { name: 'index', type: 'string', initialValue: '01/' },
        { name: 'tag', type: 'string' },
        { name: 'heading', type: 'string' },
        { name: 'description', type: 'text', rows: 2 }
      ]
    },
    {
      name: 'card2',
      title: 'Slot 2: Top Right Wide Card (e.g., UV Retention)',
      type: 'object',
      fields: [
        { name: 'index', type: 'string', initialValue: '02/' },
        { name: 'tag', type: 'string' },
        { name: 'heading', type: 'string' },
        { name: 'description', type: 'text', rows: 2 }
      ]
    },
    {
      name: 'card3',
      title: 'Slot 3: Bottom Right Square Card (e.g., Steam Sanitization)',
      type: 'object',
      fields: [
        { name: 'index', type: 'string', initialValue: '03/' },
        { name: 'tag', type: 'string' },
        { name: 'heading', type: 'string' },
        { name: 'description', type: 'text', rows: 2 }
      ]
    },
    {
      name: 'card4',
      title: 'Slot 4: Bottom Left Square Card (e.g., Metallic)',
      type: 'object',
      fields: [
        { name: 'index', type: 'string', initialValue: '04/' },
        { name: 'tag', type: 'string' },
        { name: 'heading', type: 'string' },
        { name: 'description', type: 'text', rows: 2 }
      ]
    }

  ]
}