import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (

<div class="container">
  <div class="top">
    <div class="square">
      <div class="square">
        <div class="square">
          <div class="square">
            <div class="square"><div class="square">
            </div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bottom">
    <div class="square">
      <div class="square">
        <div class="square">
          <div class="square">
            <div class="square"><div class="square">
            </div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="left">
    <div class="square">
      <div class="square">
        <div class="square">
          <div class="square">
            <div class="square"><div class="square">
            </div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="right">
    <div class="square">
      <div class="square">
        <div class="square">
          <div class="square">
            <div class="square"><div class="square">
            </div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};
