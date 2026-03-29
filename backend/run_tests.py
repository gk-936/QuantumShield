import subprocess, sys

result = subprocess.run(
    [sys.executable, "test_pqc.py"],
    capture_output=True, text=True, timeout=30,
    cwd=r"g:\CYS\4\pnb\QuantumShield\backend"
)

with open(r"g:\CYS\4\pnb\QuantumShield\backend\test_out.txt", "w", encoding="utf-8") as f:
    f.write(result.stdout)
    if result.stderr:
        f.write("\n\nSTDERR:\n" + result.stderr)
    f.write(f"\n\nReturn code: {result.returncode}\n")
