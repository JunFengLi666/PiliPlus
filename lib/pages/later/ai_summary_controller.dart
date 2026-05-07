import 'package:flutter/material.dart';
import 'package:PiliPlus/http/loading_state.dart';
import 'package:PiliPlus/http/user.dart';
import 'package:PiliPlus/models/common/later_view_type.dart';
import 'package:PiliPlus/models_new/later/ai_summary_data.dart';
import 'package:PiliPlus/pages/common/common_list_controller.dart';
import 'package:PiliPlus/pages/common/multi_select/base.dart';
import 'package:PiliPlus/pages/common/multi_select/multi_select_controller.dart';
import 'package:PiliPlus/pages/later/base_controller.dart';
import 'package:PiliPlus/pages/later/child_view.dart';
import 'package:PiliPlus/utils/accounts.dart';
import 'package:get/get.dart';
import 'package:flutter_smart_dialog/flutter_smart_dialog.dart';
import 'package:PiliPlus/common/widgets/dialog/dialog.dart';

mixin LaterAiSummaryListController
    on CommonListController<LaterAiSummaryData, LaterAiSummaryItem>,
        CommonMultiSelectMixin<LaterAiSummaryItem> {
  @override
  void onRemove();
}

class LaterAiSummaryController
    extends MultiSelectController<LaterAiSummaryData, LaterAiSummaryItem>
    with LaterAiSummaryListController {
  LaterAiSummaryController();

  late final mid = Accounts.main.mid;

  final RxBool asc = false.obs;

  final LaterBaseController baseCtr = Get.find<LaterBaseController>();

  @override
  RxBool get enableMultiSelect => baseCtr.enableMultiSelect;

  @override
  RxInt get rxCount => baseCtr.checkedCount;

  @override
  Future<LoadingState<LaterAiSummaryData>> customGetData() =>
      UserHttp.laterAiSummaryList(
        page: page,
        asc: asc.value,
      );

  @override
  void onInit() {
    super.onInit();
    queryData();
  }

  @override
  List<LaterAiSummaryItem>? getDataList(LaterAiSummaryData response) {
    baseCtr.counts[LaterViewType.aiSummary.index] = response.count ?? 0;
    return response.list;
  }

  @override
  void checkIsEnd(int length) {
    if (length >= baseCtr.counts[LaterViewType.aiSummary.index]) {
      isEnd = true;
    }
  }

  @override
  Future<void> onReload() {
    scrollController.jumpToTop();
    return super.onReload();
  }

  final Map<String, String> _aiSummaryCache = {};

  String? getAiSummaryCache(String bvid) => _aiSummaryCache[bvid];

  Future<void> loadAiSummaryCache(List<LaterAiSummaryItem> items) async {
    for (final item in items) {
      if (item.hasAiSummary && item.aiSummary != null) {
        _aiSummaryCache[item.bvid!] = item.aiSummary!;
      }
    }
  }

  @override
  void onRemove() {
    if (allChecked.isEmpty) return;

    showConfirmDialog(
      context: Get.context!,
      title: const Text('提示'),
      content: const Text('确认删除所选稍后再看吗？'),
      onConfirm: () async {
        final removeList = allChecked.toSet();
        SmartDialog.showLoading(msg: '请求中');
        final res = await UserHttp.toViewDel(
          aids: removeList.map((item) => item.aid).join(','),
        );
        if (res.isSuccess) {
          afterDelete(removeList);
          SmartDialog.showToast('已删除');
        }
        SmartDialog.dismiss();
      },
    );
  }

  void toViewDel(
    BuildContext context,
    int index,
    LaterAiSummaryItem item,
  ) {
    showConfirmDialog(
      context: context,
      title: const Text('提示'),
      content: const Text('确定移除该视频吗？'),
      onConfirm: () async {
        final res = await UserHttp.toViewDel(aids: item.aid.toString());
        if (res.isSuccess) {
          loadingState
            ..value.data!.list!.removeAt(index)
            ..refresh();
          SmartDialog.showToast('已移除');
        } else {
          res.toast();
        }
      },
    );
  }
}
