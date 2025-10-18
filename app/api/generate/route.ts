import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = '2K', watermark = true } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: '未提供提示词' },
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

    // 调用火山引擎 AI 生图 API
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'ep-20251016145954-w8c9n',
        prompt: prompt,
        sequential_image_generation: 'disabled',
        response_format: 'url',
        size: size,
        stream: false,
        watermark: watermark,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('火山引擎 AI 生图 API 错误:', errorText);
      return NextResponse.json(
        { error: `API 请求失败: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    // 提取生成的图片 URL
    const imageUrl = result.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: '未能生成图片' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: imageUrl,
      raw: result,
    });
  } catch (error) {
    console.error('AI 生图失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    );
  }
}
