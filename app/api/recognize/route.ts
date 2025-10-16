import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: '未提供图片数据' },
        { status: 400 }
      );
    }

    // 从环境变量中获取 API Key
    const apiKey = process.env.ARK_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key 未配置' },
        { status: 500 }
      );
    }

    // 调用火山引擎 API
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'ep-20251016135624-2qlh2',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '识别图片',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('火山引擎 API 错误:', errorText);
      return NextResponse.json(
        { error: `API 请求失败: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    // 提取 AI 返回的内容
    const content = result.choices?.[0]?.message?.content || '未能识别图片内容';

    return NextResponse.json({
      content,
      raw: result,
    });
  } catch (error) {
    console.error('图片识别失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    );
  }
}
