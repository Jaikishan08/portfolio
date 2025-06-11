
document.addEventListener("DOMContentLoaded", () => {
    const wrap = document.getElementById("profile-card-wrapper");
  
    if (!wrap) return;
  
    // Create the profile card container
    const card = document.createElement("section");
    card.className = "pc-card";
    wrap.className = "pc-card-wrapper";
    wrap.appendChild(card);
  
    const content = `
      <div class="pc-inside">
        <div class="pc-shine"></div>
        <div class="pc-glare"></div>
        <div class="pc-content pc-avatar-content">
          <img class="avatar" src="avatar.png.jpg" alt="User avatar" loading="lazy" />
          <div class="pc-user-info">
            <div class="pc-user-details">
              <div class="pc-mini-avatar">
                <img src="avatar.png.jpg" alt="Mini avatar" loading="lazy" />
              </div>
              <div class="pc-user-text">
                <div class="pc-handle">@nothingjust.jk</div>
                <div class="pc-status">Online</div>
              </div>
            </div>
            <a href="#contact">    </a>
            <button class="pc-contact-btn" type="button">Contact Me</button>
          </div>
        </div>
        <div class="pc-content">
          <div class="pc-details">
            <h3>Jaikishan</h3>
            <p>Developer</p>
          </div>
        </div>
      </div>
    `;
  
    card.innerHTML = content;
  
    const animationHandlers = (() => {
      let rafId = null;
  
      const clamp = (val, min = 0, max = 100) => Math.min(Math.max(val, min), max);
      const round = (val, precision = 3) => parseFloat(val.toFixed(precision));
      const adjust = (val, fromMin, fromMax, toMin, toMax) => round(toMin + ((toMax - toMin) * (val - fromMin)) / (fromMax - fromMin));
      const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  
      const updateCardTransform = (offsetX, offsetY) => {
        const width = card.clientWidth;
        const height = card.clientHeight;
  
        const percentX = clamp((100 / width) * offsetX);
        const percentY = clamp((100 / height) * offsetY);
  
        const centerX = percentX - 50;
        const centerY = percentY - 50;
  
        const props = {
          "--pointer-x": `${percentX}%`,
          "--pointer-y": `${percentY}%`,
          "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
          "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
          "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
          "--pointer-from-top": `${percentY / 100}`,
          "--pointer-from-left": `${percentX / 100}`,
          "--rotate-x": `${round(-(centerX / 5))}deg`,
          "--rotate-y": `${round(centerY / 4)}deg`,
        };
  
        for (const [key, value] of Object.entries(props)) {
          wrap.style.setProperty(key, value);
        }
      };
  
      const createSmoothAnimation = (duration, startX, startY) => {
        const startTime = performance.now();
        const targetX = wrap.clientWidth / 2;
        const targetY = wrap.clientHeight / 2;
  
        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = clamp(elapsed / duration);
          const eased = easeInOutCubic(progress);
  
          const currentX = adjust(eased, 0, 1, startX, targetX);
          const currentY = adjust(eased, 0, 1, startY, targetY);
  
          updateCardTransform(currentX, currentY);
  
          if (progress < 1) {
            rafId = requestAnimationFrame(animate);
          }
        };
  
        rafId = requestAnimationFrame(animate);
      };
  
      const cancelAnimation = () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };
  
      return { updateCardTransform, createSmoothAnimation, cancelAnimation };
    })();
  
    card.addEventListener("pointerenter", (e) => {
      animationHandlers.cancelAnimation();
      wrap.classList.add("active");
      card.classList.add("active");
    });
  
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      animationHandlers.updateCardTransform(e.clientX - rect.left, e.clientY - rect.top);
    });
  
    card.addEventListener("pointerleave", (e) => {
      animationHandlers.createSmoothAnimation(600, e.offsetX, e.offsetY);
      wrap.classList.remove("active");
      card.classList.remove("active");
    });
  
    // Initial animation
    const initX = wrap.clientWidth - 70;
    const initY = 60;
    animationHandlers.updateCardTransform(initX, initY);
    animationHandlers.createSmoothAnimation(1500, initX, initY);
  });
  
