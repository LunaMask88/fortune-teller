#!/usr/bin/env python3
"""通过 GitHub Git Data API 批量推送所有文件（绕过 git push 网络限制）"""
import subprocess, json, base64, sys

REPO   = "LunaMask88/fortune-teller"
BRANCH = "main"
MSG    = "init: MysticOracle fortune-teller app"

def gh(endpoint, method="GET", data=None):
    cmd = ["gh", "api", f"repos/{REPO}/{endpoint}", "--jq", "."]
    if method != "GET":
        cmd += ["--method", method]
    if data is not None:
        cmd += ["--input", "-"]
    r = subprocess.run(cmd, input=json.dumps(data) if data is not None else None,
                       capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip())
    return json.loads(r.stdout) if r.stdout.strip() else {}

# 获取所有 git 追踪的文件
files = subprocess.run(["git", "ls-files"], capture_output=True, text=True).stdout.splitlines()
print(f"共 {len(files)} 个文件需要推送\n")

# 获取当前分支状态
try:
    ref = gh(f"git/refs/heads/{BRANCH}")
    current_sha = ref["object"]["sha"]
    base_tree   = gh(f"git/commits/{current_sha}")["tree"]["sha"]
    print(f"当前 commit: {current_sha[:7]}  base tree: {base_tree[:7]}")
except Exception:
    current_sha = None
    base_tree   = None
    print("远端分支为空，将创建初始 commit")

# 为每个文件创建 blob
print("\n[1/3] 创建 blobs...")
tree_entries = []
for f in files:
    print(f"  {f} ...", end="", flush=True)
    try:
        content = open(f, "rb").read()
        b64     = base64.b64encode(content).decode()
        blob    = gh("git/blobs", "POST", {"content": b64, "encoding": "base64"})
        tree_entries.append({"path": f, "mode": "100644", "type": "blob", "sha": blob["sha"]})
        print(f" ✅ {blob['sha'][:7]}")
    except Exception as e:
        print(f" ❌ {e}")
        sys.exit(1)

# 创建 tree
print("\n[2/3] 创建 tree...")
tree_data = {"tree": tree_entries}
if base_tree:
    tree_data["base_tree"] = base_tree
tree = gh("git/trees", "POST", tree_data)
print(f"  tree sha: {tree['sha'][:7]} ✅")

# 创建 commit
print("\n[3/3] 创建 commit 并更新分支...")
commit_data = {"message": MSG, "tree": tree["sha"], "parents": [current_sha] if current_sha else []}
commit = gh("git/commits", "POST", commit_data)
print(f"  commit sha: {commit['sha'][:7]} ✅")

gh(f"git/refs/heads/{BRANCH}", "PATCH", {"sha": commit["sha"], "force": True})
print(f"\n✅ 推送完成！https://github.com/{REPO}")
