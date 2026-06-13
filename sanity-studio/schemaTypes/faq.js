// sanity/schemas/faq.js
export default {
  name: 'faq',
  title: 'Frequently Asked Questions',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question Text',
      type: 'string',
      description: 'e.g., "01 / How long do your detailing packages take to complete?"'
    },
    {
      name: 'answer',
      title: 'Answer Body Text',
      type: 'text',
      rows: 3,
      description: 'The detailed response or clarification statement.'
    },
    {
      name: 'orderWeight',
      title: 'Display Order Weight',
      type: 'number',
      description: 'Use numbers (1, 2, 3) to strictly control the top-to-bottom sequence.'
    }
  ],
  orderings: [
    {
      title: 'Manual Sort Order',
      name: 'orderWeightAsc',
      by: [{ field: 'orderWeight', direction: 'asc' }]
    }
  ]
}