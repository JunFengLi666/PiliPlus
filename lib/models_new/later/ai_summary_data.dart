import 'package:PiliPlus/models_new/later/list.dart';

class LaterAiSummaryItem extends LaterItemModel {
  String? aiSummary;
  bool hasAiSummary;

  LaterAiSummaryItem({
    super.aid,
    super.pic,
    super.title,
    super.pubdate,
    super.duration,
    super.owner,
    super.stat,
    super.cid,
    super.bvid,
    super.dimension,
    this.aiSummary,
    this.hasAiSummary = false,
  });

  factory LaterAiSummaryItem.fromJson(Map<String, dynamic> json) {
    final item = LaterAiSummaryItem(
      aid: json['aid'] as int?,
      pic: json['pic'] as String?,
      title: json['title'] as String?,
      pubdate: json['pubdate'] as int?,
      duration: json['duration'] as int?,
      owner: json['owner'] == null
          ? null
          : Owner.fromJson(json['owner'] as Map<String, dynamic>),
      stat: json['stat'] == null
          ? null
          : Stat.fromJson(json['stat'] as Map<String, dynamic>),
      cid: json['cid'] as int?,
      bvid: json['bvid'] as String?,
      dimension: json['dimension'] == null
          ? null
          : Dimension.fromJson(json['dimension'] as Map<String, dynamic>),
      aiSummary: json['ai_summary'] as String?,
      hasAiSummary: json['has_ai_summary'] as bool? ?? false,
    );
    return item;
  }

  String? get cover => pic;
  String? get upName => owner?.name;
  int? get viewCount => stat?.view;
}

class LaterAiSummaryData {
  int? count;
  List<LaterAiSummaryItem>? list;

  LaterAiSummaryData({
    this.count,
    this.list,
  });

  factory LaterAiSummaryData.fromJson(Map<String, dynamic> json) {
    return LaterAiSummaryData(
      count: json['count'] as int?,
      list: (json['list'] as List<dynamic>?)
          ?.map((e) => LaterAiSummaryItem.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  bool get isEmpty => list == null || list!.isEmpty;
  bool get isNotEmpty => !isEmpty;
}
