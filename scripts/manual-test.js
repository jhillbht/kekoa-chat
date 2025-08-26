const { processUserMessage } = require('../src/lib/conversationEngine.ts');

async function runManualTests() {
  console.log('🧪 Starting Manual Tests for Kekoa Chat\n');

  const initialCurriculum = {
    subject: '',
    targetAudience: '',
    duration: '',
    objectives: [],
    lessons: [],
    resources: [],
    assessments: []
  };

  const initialMessage = {
    id: '1',
    role: 'assistant',
    content: 'Initial message',
    timestamp: new Date()
  };

  console.log('Test 1: Subject Extraction');
  try {
    const result1 = await processUserMessage(
      'I want to teach JavaScript to beginners',
      initialCurriculum,
      [initialMessage]
    );
    console.log('✅ Subject extracted:', result1.updatedCurriculum?.subject);
    console.log('📝 Response preview:', result1.response.substring(0, 100) + '...\n');
  } catch (error) {
    console.log('❌ Test 1 failed:', error.message);
  }

  console.log('Test 2: Target Audience Extraction');
  try {
    const curriculum2 = { ...initialCurriculum, subject: 'JavaScript' };
    const result2 = await processUserMessage(
      'Complete beginners with no programming experience',
      curriculum2,
      [initialMessage]
    );
    console.log('✅ Audience extracted:', result2.updatedCurriculum?.targetAudience);
    console.log('📝 Response preview:', result2.response.substring(0, 100) + '...\n');
  } catch (error) {
    console.log('❌ Test 2 failed:', error.message);
  }

  console.log('Test 3: Duration Extraction');
  try {
    const curriculum3 = { 
      ...initialCurriculum, 
      subject: 'JavaScript', 
      targetAudience: 'Beginners' 
    };
    const result3 = await processUserMessage(
      '8 weeks, 2 hours per week',
      curriculum3,
      [initialMessage]
    );
    console.log('✅ Duration extracted:', result3.updatedCurriculum?.duration);
    console.log('📝 Response preview:', result3.response.substring(0, 100) + '...\n');
  } catch (error) {
    console.log('❌ Test 3 failed:', error.message);
  }

  console.log('Test 4: Objectives Extraction');
  try {
    const curriculum4 = { 
      ...initialCurriculum, 
      subject: 'JavaScript', 
      targetAudience: 'Beginners',
      duration: '8 weeks'
    };
    const result4 = await processUserMessage(
      'Students should understand variables and functions, learn DOM manipulation, build a simple web app',
      curriculum4,
      [initialMessage]
    );
    console.log('✅ Objectives extracted:', result4.updatedCurriculum?.objectives.length, 'items');
    console.log('📝 First objective:', result4.updatedCurriculum?.objectives[0] || 'None');
    console.log('📝 Response preview:', result4.response.substring(0, 100) + '...\n');
  } catch (error) {
    console.log('❌ Test 4 failed:', error.message);
  }

  console.log('🎉 Manual Testing Complete!\n');
  console.log('📋 To run automated tests: npm test');
  console.log('🚀 To start development server: npm run dev');
}

// Run the tests
runManualTests().catch(console.error);
