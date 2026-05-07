import 'package:PiliPlus/common/widgets/image/network_img_layer.dart';
import 'package:PiliPlus/common/widgets/selectable_text.dart';
import 'package:PiliPlus/models_new/video/video_ai_conclusion/model_result.dart';
import 'package:PiliPlus/utils/duration_utils.dart';
import 'package:flutter/material.dart';

Future<void> showAiSummaryBeforePlaySheet({
  required BuildContext context,
  required String title,
  required String? pic,
  required AiConclusionResult? aiResult,
  required VoidCallback onPlay,
  required VoidCallback onRemove,
}) {
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    builder: (context) => _AiSummaryBeforePlayContent(
      title: title,
      pic: pic,
      aiResult: aiResult,
      onPlay: onPlay,
      onRemove: onRemove,
    ),
  );
}

class _AiSummaryBeforePlayContent extends StatelessWidget {
  const _AiSummaryBeforePlayContent({
    required this.title,
    required this.pic,
    required this.aiResult,
    required this.onPlay,
    required this.onRemove,
  });

  final String title;
  final String? pic;
  final AiConclusionResult? aiResult;
  final VoidCallback onPlay;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Material(
      color: theme.colorScheme.surface,
      borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            GestureDetector(
              onTap: Navigator.of(context).pop,
              child: SizedBox(
                height: 35,
                child: Center(
                  child: Container(
                    width: 32,
                    height: 3,
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary,
                      borderRadius: const BorderRadius.all(Radius.circular(3)),
                    ),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              child: Row(
                children: [
                  if (pic != null)
                    NetworkImgLayer(
                      src: pic,
                      width: 50,
                      height: 50,
                      borderRadius: BorderRadius.circular(6),
                    ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: theme.textTheme.bodyMedium!.fontSize,
                        height: 1.42,
                        letterSpacing: 0.3,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Divider(
              height: 20,
              color: theme.dividerColor.withValues(alpha: 0.1),
            ),
            if (aiResult?.summary?.isNotEmpty == true)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                child: selectableText(
                  aiResult!.summary!,
                  style: const TextStyle(
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
              ),
            if (aiResult?.outline?.isNotEmpty == true) ...[
              const SizedBox(height: 12),
              ...aiResult!.outline!.map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.title ?? '',
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      ...?item.partOutline?.map(
                        (part) => Padding(
                          padding: const EdgeInsets.only(left: 8, bottom: 2),
                          child: Text.rich(
                            TextSpan(
                              style: const TextStyle(
                                fontSize: 12,
                                height: 1.5,
                              ),
                              children: [
                                TextSpan(
                                  text: DurationUtils.formatDuration(
                                    part.timestamp,
                                  ),
                                  style: TextStyle(
                                    color: theme.colorScheme.primary,
                                  ),
                                ),
                                const TextSpan(text: ' '),
                                TextSpan(text: part.content ?? ''),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: onRemove,
                      style: OutlinedButton.styleFrom(
                        foregroundColor: theme.colorScheme.error,
                        side: BorderSide(color: theme.colorScheme.error),
                      ),
                      child: const Text('不看了，移除'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: FilledButton(
                      onPressed: onPlay,
                      child: const Text('播放视频'),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}
