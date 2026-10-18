# Kullanım: mix.py <video_sessiz.mp4> <müzik.wav> <çıktı.mp4> <ses_dosyası@saniye> ...
# Seslendirme: tonlama (EQ + kompresör + hafif oda), müzik konuşma altında otomatik kısılır (sidechain), -14 LUFS.
import sys, subprocess
video, music, outp = sys.argv[1:4]; vos = [a.split("@") for a in sys.argv[4:]]
cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", video, "-i", music]
for f, _ in vos: cmd += ["-i", f]
fc = []
for i, (_, at) in enumerate(vos):
    ms = int(float(at) * 1000)
    fc.append(f"[{i+2}:a]aresample=44100,pan=stereo|c0=c0|c1=c0,adelay={ms}|{ms}[v{i}]")
fc.append("".join(f"[v{i}]" for i in range(len(vos))) + f"amix=inputs={len(vos)}:normalize=0:duration=longest,apad[vm]")
fc.append("[vm]highpass=f=85,equalizer=f=220:t=q:w=1.2:g=-2,equalizer=f=3200:t=q:w=1:g=3.5,equalizer=f=9000:t=q:w=1:g=2,"
          "acompressor=threshold=0.08:ratio=3.5:attack=4:release=70:makeup=2.2,aecho=0.8:0.5:24:0.06,volume=1.25,asplit=2[vox][sc]")
import os
fc.append(f"[1:a]volume={os.environ.get('MUSG', '0.62')}[mus]")
fc.append(f"[mus][sc]sidechaincompress=threshold={os.environ.get('SCT', '0.025')}:ratio={os.environ.get('SCR', '7')}:attack=15:release=320[duck]")
fc.append("[duck][vox]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100[out]")
cmd += ["-filter_complex", ";".join(fc), "-map", "0:v", "-map", "[out]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", outp]
subprocess.run(cmd, check=True); print("ok", outp)
