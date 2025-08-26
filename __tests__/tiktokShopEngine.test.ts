import { processTikTokShopMessage } from '@/lib/tiktokShopEngine'
import { TikTokShopStructure, Message } from '@/types'

describe('TikTok Shop Engine', () => {
  const initialTikTokShop: TikTokShopStructure = {
    businessName: '',
    niche: '',
    targetAudience: '',
    products: [],
    contentStrategy: '',
    postingSchedule: '',
    marketingGoals: [],
    budget: '',
    competitorAnalysis: []
  }

  const initialMessage: Message = {
    id: '1',
    role: 'assistant',
    content: 'Initial message',
    timestamp: new Date()
  }

  test('should extract business name from initial message', async () => {
    const result = await processTikTokShopMessage(
      'I want to create a TikTok shop for my skincare brand called GlowUp Beauty',
      initialTikTokShop,
      [initialMessage]
    )

    expect(result.updatedTikTokShop?.businessName).toBe('A tiktok shop for my skincare brand called glowup beauty')
    expect(result.response).toContain('TikTok Shop')
    expect(result.response).toContain('niche')
  })

  test('should extract niche', async () => {
    const shopWithName = {
      ...initialTikTokShop,
      businessName: 'GlowUp Beauty'
    }

    const result = await processTikTokShopMessage(
      'Beauty and skincare products',
      shopWithName,
      [initialMessage]
    )

    expect(result.updatedTikTokShop?.niche).toBe('Beauty and skincare products')
    expect(result.response).toContain('target audience')
  })

  test('should extract target audience', async () => {
    const shopWithNameAndNiche = {
      ...initialTikTokShop,
      businessName: 'GlowUp Beauty',
      niche: 'Skincare'
    }

    const result = await processTikTokShopMessage(
      'Women aged 25-35 who are interested in clean beauty and natural skincare',
      shopWithNameAndNiche,
      [initialMessage]
    )

    expect(result.updatedTikTokShop?.targetAudience).toBe('Women aged 25-35 who are interested in clean beauty and natural skincare')
    expect(result.response).toContain('product lineup')
  })

  test('should extract products', async () => {
    const shopWithBasics = {
      ...initialTikTokShop,
      businessName: 'GlowUp Beauty',
      niche: 'Skincare',
      targetAudience: 'Women 25-35'
    }

    const result = await processTikTokShopMessage(
      'Vitamin C serum $29, Retinol cream $35, Gentle cleanser $18',
      shopWithBasics,
      [initialMessage]
    )

    expect(result.updatedTikTokShop?.products.length).toBeGreaterThan(0)
    expect(result.response).toContain('product')
  })

  test('should handle empty messages gracefully', async () => {
    const result = await processTikTokShopMessage(
      '',
      initialTikTokShop,
      [initialMessage]
    )

    expect(result.response).toBeTruthy()
    expect(result.updatedTikTokShop).toBeDefined()
  })

  test('should extract content strategy', async () => {
    const shopWithProducts = {
      ...initialTikTokShop,
      businessName: 'GlowUp Beauty',
      niche: 'Skincare',
      targetAudience: 'Women 25-35',
      products: [{
        id: '1',
        name: 'Vitamin C Serum',
        description: 'Brightening serum',
        price: 29,
        category: 'skincare',
        targetAudience: 'Women 25-35',
        keywords: ['vitamin c', 'serum'],
        contentIdeas: [],
        hooks: [],
        callToActions: []
      }]
    }

    const result = await processTikTokShopMessage(
      'I want to focus on before/after content and skincare routines',
      shopWithProducts,
      [initialMessage]
    )

    expect(result.updatedTikTokShop?.contentStrategy).toBe('I want to focus on before/after content and skincare routines')
    expect(result.response).toContain('posting')
  })
})
