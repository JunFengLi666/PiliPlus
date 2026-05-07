import 'package:PiliPlus/pages/later/child_view.dart';
import 'package:flutter/material.dart';

enum LaterViewType {
  all(0, '全部'),
  unfinished(2, '未看完'),
  aiSummary(4, 'AI总结'),
  ;

  Widget get page => LaterViewChildPage(laterViewType: this);

  final int type;
  final String title;
  const LaterViewType(this.type, this.title);
}
