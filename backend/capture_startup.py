import subprocess, sys

result = subprocess.run(
    [sys.executable, "run_server.py"],
    capture_output=True, text=True, timeout=15,
    cwd=r"g:\CYS\4\pnb\QuantumShield\backend"
)

with open(r"g:\CYS\4\pnb\QuantumShield\backend\startup_log.txt", "w", encoding="utf-8") as f:
    f.write("STDOUT:\n")
    f.write(result.stdout)
    f.write("\n\nSTDERR:\n")
    f.write(result.stderr)
    f.write(f"\n\nReturn code: {result.returncode}\n")
