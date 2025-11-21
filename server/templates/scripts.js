// Script templates for different video types
const scriptTemplates = {
  tutorial: {
    hook: "Want to learn [TOPIC] but don't know where to start? In this video, I'll show you exactly how to [MAIN GOAL] step by step, even if you're a complete beginner.",
    intro: "Hey everyone, I'm [NAME] and I've been [RELEVANT EXPERIENCE] for [TIME]. Today I'm going to teach you [TOPIC] in the simplest way possible. By the end of this video, you'll be able to [OUTCOME].",
    content: "Step 1: [FIRST STEP]\n[Detailed explanation]\n\nStep 2: [SECOND STEP]\n[Detailed explanation]\n\nStep 3: [THIRD STEP]\n[Detailed explanation]\n\nPro Tip: [HELPFUL TIP]",
    cta: "If this helped you, smash that like button and subscribe for more tutorials! Drop a comment if you have questions. Check out the links in the description for [RESOURCE]."
  },
  
  review: {
    hook: "I've been testing [PRODUCT/TOPIC] for [TIME] and the results are [ADJECTIVE]. Here's everything you need to know before you buy.",
    intro: "What's up guys, [NAME] here. Today I'm giving you my honest review of [PRODUCT/TOPIC]. I've used this for [TIME] so I can give you the real deal - the good, the bad, and everything in between.",
    content: "First, let's talk about what I loved:\n[POSITIVE POINTS]\n\nNow, here's what could be better:\n[NEGATIVE POINTS]\n\nOverall verdict:\n[FINAL THOUGHTS]",
    cta: "What do you think? Have you tried [PRODUCT/TOPIC]? Let me know in the comments! Don't forget to like and subscribe for more honest reviews."
  },
  
  list: {
    hook: "I've tested hundreds of [TOPIC] and these are the [NUMBER] best ones you need to know about in 2025.",
    intro: "Hey everyone! Today I'm sharing [NUMBER] [TOPIC] that have completely changed [RELEVANT AREA]. I've personally used all of these, so you know they're legit.",
    content: "Number [N]: [ITEM NAME]\n[Why it's great]\n\nNumber [N-1]: [ITEM NAME]\n[Why it's great]\n\nNumber [N-2]: [ITEM NAME]\n[Why it's great]\n\nAnd the number one [TOPIC] is...",
    cta: "Which of these surprised you? Let me know in the comments! Hit subscribe if you want more lists like this."
  },
  
  challenge: {
    hook: "I'm doing [CHALLENGE] for [TIME] and documenting everything. Here's what happened on day [NUMBER].",
    intro: "What's going on everyone! I'm [NAME] and I'm taking on the [CHALLENGE] challenge. I'll be doing this for [TIME] and sharing my honest experience with you every step of the way.",
    content: "Day 1: [EXPERIENCE]\nDay 2: [EXPERIENCE]\nDay 3: [EXPERIENCE]\n\nWhat I learned:\n[INSIGHTS]\n\nWould I do it again?\n[CONCLUSION]",
    cta: "Should I try [NEXT CHALLENGE]? Let me know! Subscribe to follow along with my next challenge."
  },
  
  comparison: {
    hook: "[OPTION A] vs [OPTION B] - I tested both for [TIME] and here's which one actually wins.",
    intro: "Today I'm settling the debate once and for all. I've spent [TIME] testing both [OPTION A] and [OPTION B] side by side, and I'm going to show you exactly which one comes out on top.",
    content: "[OPTION A]:\n[Pros and cons]\n\n[OPTION B]:\n[Pros and cons]\n\nHead-to-head comparison:\n[DIRECT COMPARISON]\n\nThe winner is...",
    cta: "Which one do you prefer? Drop your thoughts in the comments! Like and subscribe for more comparisons."
  },
  
  tips: {
    hook: "These [NUMBER] [TOPIC] tips will save you [TIME/MONEY/EFFORT]. I wish I knew these sooner!",
    intro: "Hey everyone! I've been [RELEVANT EXPERIENCE] for [TIME] and I've learned a lot along the way. Today I'm sharing [NUMBER] game-changing tips that I wish someone had told me when I started.",
    content: "Tip #1: [TIP]\n[Explanation and example]\n\nTip #2: [TIP]\n[Explanation and example]\n\nTip #3: [TIP]\n[Explanation and example]\n\nBonus tip: [BONUS TIP]",
    cta: "Which tip was most helpful? Share your own tips in the comments! Subscribe for more [TOPIC] content."
  },
  
  news: {
    hook: "[BREAKING NEWS/UPDATE] just happened and it's going to change [TOPIC] forever. Here's what you need to know.",
    intro: "What's up everyone, [NAME] here with breaking news about [TOPIC]. This just happened and it's a big deal. Let me break down what this means for you.",
    content: "What happened:\n[NEWS DETAILS]\n\nWhy it matters:\n[SIGNIFICANCE]\n\nWhat this means for you:\n[IMPACT]\n\nWhat's next:\n[FUTURE IMPLICATIONS]",
    cta: "What do you think about this? Let's discuss in the comments! Make sure to subscribe so you don't miss updates on this story."
  },
  
  story: {
    hook: "This is the story of how I [ACHIEVEMENT] and the [NUMBER] lessons I learned that changed everything.",
    intro: "Hey everyone, I'm [NAME] and today I'm sharing a personal story that I think will really resonate with you. This is about [TOPIC] and how it transformed my [RELEVANT AREA].",
    content: "The beginning:\n[STORY START]\n\nThe challenge:\n[OBSTACLES]\n\nThe turning point:\n[KEY MOMENT]\n\nWhat I learned:\n[LESSONS]\n\nWhere I am now:\n[CURRENT STATE]",
    cta: "Have you had a similar experience? I'd love to hear your story in the comments. If this resonated with you, please like and subscribe."
  }
};

module.exports = { scriptTemplates };

