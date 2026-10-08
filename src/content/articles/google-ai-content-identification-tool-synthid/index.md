---
isDraft: false
isMainHeadline: false
isSubHeadline: false
description: >-
  谷歌近日向公众开放 SynthID Detector 工具网站，让任何人都可以上传图片、视频或音频检查是否包含 AI
  生成内容。此前，这项工具仅向部分记者、媒体从业者和研究人员开放测试。
title: 谷歌开放AI内容鉴别工具，普通人也可以火眼金睛
cover: >-
  @assets/images/articles/google-ai-content-identification-tool-synthid/cover.png
category:
  - daily
  - business
tags:
  - ai
publishedTime: 2026-10-08T12:06:00.000Z
authors:
  - johnny
---
谷歌近日向公众开放 [SynthID](https://synthid.com/) Detector 工具网站，让任何人都可以上传图片、视频或音频检查是否包含 AI 生成内容。此前，这项工具仅向部分记者、媒体从业者和研究人员开放测试。

## 技术实现——SynthID

SynthID 是谷歌于2023年推出的一项数字水印技术。它不会在内容中留下肉眼可见的标记，而是在 AI 生成的图片、视频或音频中嵌入人类无法察觉的数字信号。这些水印经过设计，可以在裁剪、添加滤镜、改变视频帧率或进行有损压缩等处理后继续被检测到。

此次开放的 SynthID Detector 支持多种常见媒体格式。

| 媒体类别 | 支持格式                                              |
| ---- | ------------------------------------------------- |
| 图片   | JPG、JPEG、PNG、BMP、WEBP、AVIF、HEIC、HEIF、TIFF、TIF、GIF |
| 视频   | MP4、MOV 和 WEBM                                    |
| 音频   | WAV、MP3、OGG、FLAC、AAC 和 M4A                        |

## 适用范围

目前检测范围已经不再局限于谷歌自己的 AI 模型。谷歌表示，新版 SynthID Detector 可以识别由谷歌及其合作伙伴的 AI 系统生成或处理的内容，目前包括 OpenAI、英伟达（NVIDIA）和 Kakao，苹果（Apple）也计划加入。此前，SynthID Detector 主要用于检测谷歌 AI 生成的内容。

![](@assets/images/articles/google-ai-content-identification-tool-synthid/2026-10-08%2020.13.03.png)

目前，谷歌的 Nano Banana、Veo 和 Lyria 等模型，以及 Gemini、Flow、ProducerAI 和 Vids 等具备生成能力的产品，都已经使用 SynthID 对生成内容进行水印标记。截至目前，SynthID 已经为超过1800亿张图片和视频添加水印，覆盖的音频内容时长相当于24万年。

SynthID 的检测能力也已经被整合进谷歌搜索、Gemini 和 Chrome。这些产品目前每天处理的内容验证请求超过100万次。

## 尚有局限

它检测的是特定的数字水印，而不是单纯判断一段内容“看起来像不像 AI 生成”。如果一段内容没有使用 SynthID，检测工具自然无法仅凭这一机制确认其来源。而微软和 Meta 等其他公司也在开发自己的 AI 内容水印和验证标准。这些工具目前尚不能互通。

随着 AI 生成图片、视频和音频越来越难以分辨，行业正在从单纯依靠内容本身进行识别，转向在内容生成阶段加入可验证的来源信息。谷歌此次将 SynthID Detector 向公众开放，意味着这种内容溯源机制正在从少数专业机构使用的工具，逐步变成普通互联网用户可以直接使用的验证手段。
