import 'package:PiliPlus/models_new/video/video_ai_conclusion/model_result.dart';
import 'package:get/get.dart';

class _CacheEntry {
  final AiConclusionResult result;
  final DateTime cachedAt;

  _CacheEntry({
    required this.result,
    required this.cachedAt,
  });
}

class AiSummaryCache extends GetxService {
  final Map<String, _CacheEntry> _cache = {};
  Duration _maxAge = const Duration(hours: 1);

  AiConclusionResult? get(String bvid, int? cid) {
    final key = '${bvid}_$cid';
    final entry = _cache[key];
    if (entry == null) return null;
    if (DateTime.now().difference(entry.cachedAt) < _maxAge) {
      return entry.result;
    }
    _cache.remove(key);
    return null;
  }

  void set(String bvid, int? cid, AiConclusionResult result) {
    final key = '${bvid}_$cid';
    _cache[key] = _CacheEntry(result: result, cachedAt: DateTime.now());
  }

  void clear() {
    _cache.clear();
  }

  bool contains(String bvid, int? cid) {
    return get(bvid, cid) != null;
  }
}
