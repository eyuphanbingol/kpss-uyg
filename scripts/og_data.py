# -*- coding: utf-8 -*-

def _merge(*lists):
    seen = set()
    out = []
    for lst in lists:
        for t in lst:
            k = (t["ders"], t["title"])
            if k in seen:
                continue
            seen.add(k)
            out.append(t)
    return out


def _load():
    from og_data_ags import TOPICS as a
    chunks = [a]
    for name in ("og_data_ags_rest", "og_data_ags_edu", "og_data_ags_more", "og_data_oabt_a", "og_data_oabt_b", "og_data_oabt_c", "og_data_oabt_d", "og_data_oabt_e", "og_data_oabt_f"):
        try:
            mod = __import__(name)
            chunks.append(getattr(mod, "TOPICS", []))
        except Exception:
            pass
    return _merge(*chunks)


TOPICS = _load()
