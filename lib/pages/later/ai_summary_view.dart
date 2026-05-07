import 'package:PiliPlus/common/widgets/flutter/refresh_indicator.dart';
import 'package:PiliPlus/common/widgets/image/network_img_layer.dart';
import 'package:PiliPlus/common/widgets/stat/stat.dart';
import 'package:PiliPlus/models/common/stat_type.dart';
import 'package:PiliPlus/models/common/video/source_type.dart';
import 'package:PiliPlus/models/common/video/video_type.dart';
import 'package:PiliPlus/models_new/later/ai_summary_data.dart';
import 'package:PiliPlus/pages/later/ai_summary_controller.dart';
import 'package:PiliPlus/utils/duration_utils.dart';
import 'package:PiliPlus/utils/num_utils.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class LaterAiSummaryView extends StatelessWidget {
  const LaterAiSummaryView({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<LaterAiSummaryController>();
    return refreshIndicator(
      onRefresh: controller.onRefresh,
      child: Obx(() {
        final state = controller.loadingState.value;
        return switch (state) {
          Loading() => const Center(child: CircularProgressIndicator()),
          Success(:final response) => response != null && response.isNotEmpty
              ? ListView.builder(
                  controller: controller.scrollController,
                  padding: EdgeInsets.only(
                    top: 7,
                    bottom: MediaQuery.viewPaddingOf(context).bottom + 85,
                  ),
                  itemCount: response.list!.length + 1,
                  itemBuilder: (context, index) {
                    if (index == response.list!.length) {
                      controller.onLoadMore();
                      return const SizedBox(
                        height: 60,
                        child: Center(child: CircularProgressIndicator()),
                      );
                    }
                    final item = response.list![index];
                    return LaterAiSummaryCard(
                      item: item,
                      onPlay: () => _playVideo(context, controller, index),
                      onRemove: () => controller.toViewDel(
                        context,
                        index,
                        item,
                      ),
                    );
                  },
                )
              : const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.summarize_outlined, size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text('暂无AI总结', style: TextStyle(color: Colors.grey)),
                    ],
                  ),
                ),
          Error(:final errMsg) => Center(child: Text('加载失败: $errMsg')),
        };
      }),
    );
  }

  void _playVideo(
    BuildContext context,
    LaterAiSummaryController controller,
    int index,
  ) {
    final item = controller.loadingState.value.data!.list![index];
    Get.toNamed(
      '/video',
      arguments: {
        'bvid': item.bvid,
        'cid': item.cid,
        'aid': item.aid,
        'cover': item.cover,
        'title': item.title,
        'dimension': item.dimension,
        'videoType': VideoType.ugc,
        'heroTag': item.bvid,
        'extraArguments': {
          'sourceType': SourceType.watchLater,
          'count': controller.baseCtr.counts[LaterViewType.all.index],
          'favTitle': '稍后再看',
          'mediaId': controller.mid,
          'desc': controller.asc.value,
          'isContinuePlaying': true,
        },
      },
    );
  }
}

class LaterAiSummaryCard extends StatelessWidget {
  const LaterAiSummaryCard({
    super.key,
    required this.item,
    required this.onPlay,
    required this.onRemove,
  });

  final LaterAiSummaryItem item;
  final VoidCallback onPlay;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      child: Card(
        elevation: 2,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Stack(
                    clipBehavior: Clip.none,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: NetworkImgLayer(
                          src: item.cover,
                          width: 120,
                          height: 68,
                        ),
                      ),
                      Positioned(
                        right: 6,
                        bottom: 4,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 4,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.7),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            DurationUtils.formatDuration(item.duration),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.title ?? '',
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item.upName ?? '',
                          style: TextStyle(
                            fontSize: 12,
                            color: theme.colorScheme.outline,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            if (item.viewCount != null)
                              Text(
                                '${NumUtils.numFormat(item.viewCount!)}播放',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: theme.colorScheme.outline,
                                ),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primaryContainer.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.auto_awesome,
                          size: 16,
                          color: theme.colorScheme.primary,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'AI总结',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      item.hasAiSummary
                          ? item.aiSummary ?? ''
                          : '暂无AI总结内容',
                      maxLines: 4,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 13,
                        height: 1.5,
                        color: item.hasAiSummary
                            ? null
                            : theme.colorScheme.outline,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton.icon(
                    onPressed: onRemove,
                    icon: const Icon(Icons.delete_outline, size: 18),
                    label: const Text('移除'),
                    style: TextButton.styleFrom(
                      foregroundColor: theme.colorScheme.error,
                    ),
                  ),
                  const SizedBox(width: 8),
                  FilledButton.icon(
                    onPressed: onPlay,
                    icon: const Icon(Icons.play_arrow, size: 18),
                    label: const Text('播放'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
