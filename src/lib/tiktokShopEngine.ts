import { TikTokShopStructure, TikTokProduct, Message } from '@/types'

interface TikTokShopResponse {
  response: string
  updatedTikTokShop?: TikTokShopStructure
}

// TikTok Shop conversation flow states
enum TikTokShopStep {
  INITIAL = 'initial',
  BUSINESS_DEFINED = 'business_defined',
  NICHE_DEFINED = 'niche_defined',
  AUDIENCE_DEFINED = 'audience_defined',
  PRODUCTS_PLANNING = 'products_planning',
  CONTENT_STRATEGY = 'content_strategy',
  BUDGET_PLANNING = 'budget_planning',
  COMPETITOR_ANALYSIS = 'competitor_analysis',
  COMPLETE = 'complete'
}

export async function processTikTokShopMessage(
  userMessage: string,
  currentTikTokShop: TikTokShopStructure,
  messageHistory: Message[]
): Promise<TikTokShopResponse> {
  const currentStep = determineTikTokShopStep(currentTikTokShop, messageHistory)
  const updatedTikTokShop = { ...currentTikTokShop }
  
  let response = ''

  switch (currentStep) {
    case TikTokShopStep.INITIAL:
      // Extract business name from the message
      updatedTikTokShop.businessName = extractBusinessNameFromMessage(userMessage)
      response = generateBusinessNameResponse(updatedTikTokShop.businessName)
      break

    case TikTokShopStep.BUSINESS_DEFINED:
      // Extract niche
      updatedTikTokShop.niche = extractNicheFromMessage(userMessage)
      response = generateNicheResponse(updatedTikTokShop.niche)
      break

    case TikTokShopStep.NICHE_DEFINED:
      // Extract target audience
      updatedTikTokShop.targetAudience = extractAudienceFromMessage(userMessage)
      response = generateAudienceResponse(updatedTikTokShop.targetAudience, updatedTikTokShop.niche)
      break

    case TikTokShopStep.AUDIENCE_DEFINED:
      // Start product planning
      const products = extractProductsFromMessage(userMessage, updatedTikTokShop)
      updatedTikTokShop.products = [...updatedTikTokShop.products, ...products]
      response = generateProductPlanningResponse(updatedTikTokShop)
      break

    case TikTokShopStep.PRODUCTS_PLANNING:
      // Continue building products or move to content strategy
      if (userMessage.toLowerCase().includes('content') || userMessage.toLowerCase().includes('video') || userMessage.toLowerCase().includes('post')) {
        updatedTikTokShop.contentStrategy = extractContentStrategyFromMessage(userMessage)
        response = generateContentStrategyResponse(updatedTikTokShop)
      } else {
        const moreProducts = extractProductsFromMessage(userMessage, updatedTikTokShop)
        updatedTikTokShop.products = [...updatedTikTokShop.products, ...moreProducts]
        response = generateContinuedProductResponse(updatedTikTokShop)
      }
      break

    case TikTokShopStep.CONTENT_STRATEGY:
      // Move to budget planning
      if (userMessage.toLowerCase().includes('budget') || userMessage.toLowerCase().includes('money') || userMessage.toLowerCase().includes('cost')) {
        updatedTikTokShop.budget = extractBudgetFromMessage(userMessage)
        response = generateBudgetResponse(updatedTikTokShop)
      } else {
        updatedTikTokShop.postingSchedule = extractPostingScheduleFromMessage(userMessage)
        response = generatePostingScheduleResponse(updatedTikTokShop)
      }
      break

    case TikTokShopStep.BUDGET_PLANNING:
      // Move to competitor analysis
      const competitors = extractCompetitorAnalysisFromMessage(userMessage)
      updatedTikTokShop.competitorAnalysis = [...updatedTikTokShop.competitorAnalysis, ...competitors]
      response = generateCompetitorAnalysisResponse(updatedTikTokShop)
      break

    case TikTokShopStep.COMPETITOR_ANALYSIS:
      // Final response
      const marketingGoals = extractMarketingGoalsFromMessage(userMessage)
      updatedTikTokShop.marketingGoals = [...updatedTikTokShop.marketingGoals, ...marketingGoals]
      response = generateFinalTikTokShopResponse(updatedTikTokShop)
      break

    default:
      response = generateGenericTikTokShopResponse(userMessage, updatedTikTokShop)
  }

  return {
    response,
    updatedTikTokShop
  }
}

function determineTikTokShopStep(tiktokShop: TikTokShopStructure, messages: Message[]): TikTokShopStep {
  if (!tiktokShop.businessName) return TikTokShopStep.INITIAL
  if (!tiktokShop.niche) return TikTokShopStep.BUSINESS_DEFINED
  if (!tiktokShop.targetAudience) return TikTokShopStep.NICHE_DEFINED
  if (tiktokShop.products.length === 0) return TikTokShopStep.AUDIENCE_DEFINED
  if (!tiktokShop.contentStrategy) return TikTokShopStep.PRODUCTS_PLANNING
  if (!tiktokShop.budget) return TikTokShopStep.CONTENT_STRATEGY
  if (tiktokShop.competitorAnalysis.length === 0) return TikTokShopStep.BUDGET_PLANNING
  return TikTokShopStep.COMPETITOR_ANALYSIS
}

function extractBusinessNameFromMessage(message: string): string {
  const cleaned = message.toLowerCase()
    .replace(/^(i want to create|i'm building|my business is|business name is|i'm starting)/i, '')
    .replace(/^(a |an |the )/i, '')
    .trim()
  
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

function extractNicheFromMessage(message: string): string {
  return message.trim()
}

function extractAudienceFromMessage(message: string): string {
  return message.trim()
}

function extractProductsFromMessage(message: string, tiktokShop: TikTokShopStructure): TikTokProduct[] {
  const products: TikTokProduct[] = []
  
  // Simple product extraction - in a real app, use more sophisticated NLP
  const productParts = message.split(/product \d+|item \d+|\n|,/i)
  
  productParts.forEach((part, index) => {
    if (part.trim().length > 10) {
      const productText = part.trim()
      
      // Extract price if mentioned
      const priceMatch = productText.match(/\$(\d+(?:\.\d{2})?)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : 0
      
      products.push({
        id: crypto.randomUUID(),
        name: productText.substring(0, 50),
        description: productText,
        price: price,
        category: tiktokShop.niche,
        targetAudience: tiktokShop.targetAudience,
        keywords: extractKeywordsFromText(productText),
        contentIdeas: generateContentIdeas(productText),
        hooks: generateHooks(productText),
        callToActions: generateCTAs()
      })
    }
  })
  
  return products
}

function extractContentStrategyFromMessage(message: string): string {
  return message.trim()
}

function extractPostingScheduleFromMessage(message: string): string {
  return message.trim()
}

function extractBudgetFromMessage(message: string): string {
  return message.trim()
}

function extractCompetitorAnalysisFromMessage(message: string): string[] {
  return message.split(/,|\n/).map(comp => comp.trim()).filter(comp => comp.length > 0)
}

function extractMarketingGoalsFromMessage(message: string): string[] {
  return message.split(/,|\n|;|\d+\./).map(goal => goal.trim()).filter(goal => goal.length > 10)
}

function extractKeywordsFromText(text: string): string[] {
  // Simple keyword extraction
  const words = text.toLowerCase().split(/\s+/)
  return words.filter(word => word.length > 3 && !['this', 'that', 'with', 'have', 'will', 'from'].includes(word)).slice(0, 5)
}

function generateContentIdeas(productText: string): string[] {
  const ideas = [
    `Unboxing video for ${productText.substring(0, 20)}...`,
    `Before and after using ${productText.substring(0, 20)}...`,
    `Day in the life with ${productText.substring(0, 20)}...`,
    `Common mistakes when using ${productText.substring(0, 20)}...`,
    `5 ways to use ${productText.substring(0, 20)}...`
  ]
  return ideas
}

function generateHooks(productText: string): string[] {
  const hooks = [
    "You'll never believe what this does...",
    "This changed everything for me...",
    "POV: You discover the perfect...",
    "Everyone's asking where I got this...",
    "This is why everyone needs..."
  ]
  return hooks
}

function generateCTAs(): string[] {
  return [
    "Link in bio to shop!",
    "Get yours before they sell out!",
    "Use my code for 10% off!",
    "Which color would you choose?",
    "Tag someone who needs this!"
  ]
}

// Response generation functions
function generateBusinessNameResponse(businessName: string): string {
  return `Awesome! So we're building a TikTok Shop strategy for "${businessName}".

TikTok Shop is one of the hottest opportunities right now for e-commerce! 

What's your niche or product category? For example:
- Beauty & skincare
- Fashion & accessories  
- Home & lifestyle
- Tech gadgets
- Health & wellness
- Handmade crafts

This helps me understand your market and create targeted content strategies.`
}

function generateNicheResponse(niche: string): string {
  return `Perfect! The ${niche} space has huge potential on TikTok.

Now, who's your ideal customer? Paint me a picture of your target audience:
- Age range
- Interests and hobbies
- Shopping behavior
- What problems do your products solve for them?
- Where do they hang out online?

The more specific you can be, the better I can help you create content that converts!`
}

function generateAudienceResponse(audience: string, niche: string): string {
  return `Excellent! Your ${niche} products for ${audience} have a clear market fit.

Let's dive into your product lineup. What products do you want to feature in your TikTok Shop? 

For each product, share:
- Product name and brief description
- Price point (if you know it)
- What makes it special or unique
- Any variations (colors, sizes, etc.)

Don't worry if you don't have everything figured out yet - we can brainstorm together!`
}

function generateProductPlanningResponse(tiktokShop: TikTokShopStructure): string {
  return `Great start on your product lineup!

Current products (${tiktokShop.products.length}):
${tiktokShop.products.map((product, i) => `${i + 1}. ${product.name} ${product.price > 0 ? `($${product.price})` : ''}`).join('\n')}

Would you like to:
- Add more products to your lineup
- Start planning your content strategy  
- Develop marketing campaigns for these products
- Set up your posting schedule

What feels most important to tackle next?`
}

function generateContentStrategyResponse(tiktokShop: TikTokShopStructure): string {
  return `Excellent content strategy! This will help you connect authentically with your audience.

Now let's talk posting consistency. What's realistic for your schedule?

Consider:
- How often can you post? (Daily, 3x/week, etc.)
- Best times for your audience
- Content batching vs. daily creation
- Mix of product showcases, lifestyle content, and engaging hooks

What posting frequency feels sustainable for you?`
}

function generatePostingScheduleResponse(tiktokShop: TikTokShopStructure): string {
  return `Perfect! Consistency is key on TikTok.

Let's talk budget. What's your monthly marketing budget for:
- Paid TikTok ads (optional but powerful)
- Product sampling/giveaways
- Content creation tools
- Influencer collaborations

Even a small budget can go far with the right strategy. What are you comfortable investing monthly?`
}

function generateBudgetResponse(tiktokShop: TikTokShopStructure): string {
  return `Smart budgeting! Now let's analyze your competition.

Who are the top creators/brands in your space that you admire or compete with?

Look for:
- Similar products to yours
- Same target audience
- Successful content formats
- Pricing strategies

This helps us identify opportunities and differentiate your brand. Share any competitors you've noticed!`
}

function generateCompetitorAnalysisResponse(tiktokShop: TikTokShopStructure): string {
  return `Great competitive intelligence! 

Finally, what are your main marketing goals for the next 3-6 months?

Examples:
- Build brand awareness
- Drive direct sales  
- Grow follower count
- Establish thought leadership
- Launch new products
- Increase customer lifetime value

What success looks like for you?`
}

function generateFinalTikTokShopResponse(tiktokShop: TikTokShopStructure): string {
  return `🎉 Your TikTok Shop strategy is taking shape beautifully!

**Strategy Summary:**
- **Business:** ${tiktokShop.businessName}
- **Niche:** ${tiktokShop.niche}  
- **Audience:** ${tiktokShop.targetAudience}
- **Products:** ${tiktokShop.products.length} planned
- **Budget:** ${tiktokShop.budget}
- **Goals:** ${tiktokShop.marketingGoals.length} defined

**Your TikTok Shop Action Plan is Ready!** 

You can:
- Review your complete strategy in the sidebar
- Export your plan to share with team members
- Start implementing your content calendar
- Begin creating your first viral videos

Ready to take TikTok by storm? 🚀 What would you like to refine or add to your strategy?`
}

function generateContinuedProductResponse(tiktokShop: TikTokShopStructure): string {
  return `Added to your product catalog!

Current lineup (${tiktokShop.products.length} products):
${tiktokShop.products.slice(-3).map((product, i) => `${tiktokShop.products.length - 2 + i}. ${product.name}`).join('\n')}

Continue adding products or let's move on to planning your content strategy and posting schedule!`
}

function generateGenericTikTokShopResponse(message: string, tiktokShop: TikTokShopStructure): string {
  return `I understand! Let me help you with that aspect of your TikTok Shop strategy.

Based on your ${tiktokShop.niche} business targeting ${tiktokShop.targetAudience}, I can help you:
- Refine your product positioning
- Develop viral content ideas
- Optimize pricing strategies  
- Plan influencer collaborations
- Create conversion-focused campaigns

What specific area would you like to dive deeper into?`
}
