import React, {
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import useLast from "./hooks/useLast";
import useMousePos from "./hooks/useMousePos";
import usePan from "./hooks/usePan";
import useScale from "./hooks/useScale";
import * as pointUtils from "./util/point";

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function roundValues(obj: Record<string, number>) {
  const output: Record<string, number> = {};

  for (const key in obj) {
    output[key] = round(obj[key]);
  }

  return output;
}

export const ExampleWrapper = (props: PropsWithChildren<unknown>) => {
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    setShowExample(true);
  }, []);

  if (showExample) {
    return props.children;
  } else {
    return null;
  }
};

export const UsePanExample = () => {
  const [viewport, setViewport] = useState(pointUtils.ORIGIN);
  const [offset, startPan] = usePan();

  return (
    <div
      className="select-none bg-gray-500 overflow-hidden flex justify-center items-center  w-screen h-screen bz-50 relative "
      style={{
        backgroundImage: "url(/image/grid.svg)",
        backgroundPosition: `${-offset.x - viewport.x}px ${
          -offset.y - viewport.y
        }px`
      }}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          console.log(viewport);
          setViewport((viewport) => ({
            x: viewport.x + 300,
            y: viewport.y + 0
          }));
        }}
        className="hover:cursor-pointer z-50 py-1 px-3 rounded border block m-2 bg-gray-900 absolute bottom-0 right-0 "
      >
        Pan To!
      </button>
      <div
        onMouseDown={startPan}
        className="select-none overflow-hidden flex justify-center items-center w-screen h-screen shadow-inner border border-gray-600 text-gray-50 relative"
        // style={{
        //   transform: `translate(${viewport.x}px, ${viewport.y}px)`
        // }}
      >
        <div
          className="border-4 border-gray-100 border-opacity-50 text-center pt-10 text-gray-700 shadow-lg rounded text-4xl uppercase font-black absolute block bg-gray-400 w-32 h-32 cursor-pointer"
          style={{
            top: `${0 - roundValues(offset).y - viewport.y}px`,
            left: `${0 - roundValues(offset).x - viewport.x}px`
          }}
        >
          hi
        </div>
        <div
          className="border-4 border-gray-100 border-opacity-50 text-center pt-10 text-gray-700 shadow-lg rounded text-4xl uppercase font-black absolute block bg-gray-400 w-32 h-32 cursor-pointer"
          style={{
            top: `${100 - roundValues(offset).y - viewport.y}px`,
            left: `${500 - roundValues(offset).x - viewport.x}px`
          }}
        >
          hi2
        </div>
        <dl className="w-64 font-sans grid grid-cols-2 absolute bottom-2 left-2">
          <dt>Offset:</dt>
          <dd className="inline-block">
            {JSON.stringify(roundValues(offset))}
          </dd>
          <dt>viewpvort:</dt>
          <dd className="inline-block">
            {JSON.stringify(roundValues(viewport))}
          </dd>
        </dl>
      </div>
    </div>
  );
};

export const UseScaleExample = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const scale = useScale(ref);

  return (
    <div
      ref={ref}
      className="select-none flex justify-center items-center w-screen h-screen bg-gray-800 shadow-inner border border-gray-600 relative text-gray-50"
    >
      <dl className="w-64 font-mono grid grid-cols-2 absolute bottom-2 left-2">
        <dt>Scale</dt>
        <dd>{round(scale)}</dd>
      </dl>
    </div>
  );
};

export const UsePanScaleExample = () => {
  const [offset, startPan] = usePan();
  const ref = useRef<HTMLDivElement | null>(null);
  const scale = useScale(ref);

  return (
    <div
      ref={ref}
      onMouseDown={startPan}
      className="select-none overflow-hidden w-screen h-screen bg-gray-800 shadow-inner border border-gray-600 relative text-gray-50"
    >
      <div
        className="w-screen h-screen"
        style={{
          backgroundImage: "url(/image/grid.svg)",
          transform: `scale(${scale})`,
          backgroundPosition: `${-offset.x}px ${-offset.y}px`
        }}
      ></div>

      <dl className="w-64 font-mono grid grid-cols-2 absolute bottom-2 left-2">
        <dt>Offset</dt>
        <dd className="inline-block">{JSON.stringify(roundValues(offset))}</dd>
        <dt>Scale</dt>
        <dd>{round(scale)}</dd>
      </dl>
    </div>
  );
};

export const BufferExample = () => {
  const [buffer, setBuffer] = useState(pointUtils.ORIGIN);
  const [offset, startPan] = usePan();
  const ref = useRef<HTMLDivElement | null>(null);
  const scale = useScale(ref);

  useLayoutEffect(() => {
    const height = ref.current?.clientHeight ?? 0;
    const width = ref.current?.clientWidth ?? 0;
    setBuffer({
      x: (width - width / scale) / 2,
      y: (height - height / scale) / 2
    });
  }, [scale, setBuffer]);

  return (
    <div
      className="select-none overflow-hidden w-screen h-screen bg-gray-800 shadow-inner border border-gray-600 relative text-gray-50"
      ref={ref}
      onMouseDown={startPan}
    >
      <div
        className="absolute"
        style={{
          backgroundImage: "url(/image/grid.svg)",
          transform: `scale(${scale})`,
          backgroundPosition: `${-offset.x}px ${-offset.y}px`,
          bottom: buffer.y,
          left: buffer.x,
          right: buffer.x,
          top: buffer.y
        }}
      ></div>

      <dl className="w-64 font-mono grid grid-cols-2 absolute bottom-2 left-2">
        <dt>Offset</dt>
        <dd className="inline-block">{JSON.stringify(roundValues(offset))}</dd>
        <dt>Scale</dt>
        <dd>{round(scale)}</dd>
        <dt>Buffer</dt>
        <dd>{JSON.stringify(roundValues(buffer))}</dd>
      </dl>
    </div>
  );
};

export const TrackingExample = (props: { hideData: boolean }) => {
  const [buffer, setBuffer] = useState(pointUtils.ORIGIN);
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, startPan] = usePan();
  const scale = useScale(ref);

  // Track the mouse position.
  const mousePosRef = useMousePos(ref);

  // Track the last known offset and scale.
  const lastOffset = useLast(offset);
  const lastScale = useLast(scale);

  const delta = pointUtils.diff(offset, lastOffset);

  // Since scale also affects offset, we track our own "real" offset that's
  // changed by both panning and zooming.
  const adjustedOffset = useRef(pointUtils.sum(offset, delta));

  if (lastScale === scale) {
    adjustedOffset.current = pointUtils.sum(
      adjustedOffset.current,
      pointUtils.scale(delta, scale)
    );
  } else {
    const currMouse = pointUtils.scale(mousePosRef.current, lastScale);
    const newMouse = pointUtils.scale(mousePosRef.current, scale);
    const mouseOffset = pointUtils.diff(currMouse, newMouse);
    adjustedOffset.current = pointUtils.sum(
      adjustedOffset.current,
      mouseOffset
    );
  }

  useLayoutEffect(() => {
    const height = ref.current?.clientHeight ?? 0;
    const width = ref.current?.clientWidth ?? 0;

    setBuffer({
      x: (width - width / scale) / 2,
      y: (height - height / scale) / 2
    });
  }, [scale, setBuffer]);

  return (
    <div
      className="select-none overflow-hidden w-screen h-screen bg-gray-800 shadow-inner border border-gray-600 relative text-gray-50"
      ref={ref}
      onMouseDown={startPan}
    >
      <div
        className="absolute"
        style={{
          backgroundImage: "url(/image/grid.svg)",
          transform: `scale(${scale})`,
          backgroundPosition: `${-adjustedOffset.current.x}px ${-adjustedOffset
            .current.y}px`,
          bottom: buffer.y,
          left: buffer.x,
          right: buffer.x,
          top: buffer.y
        }}
      ></div>
      <button
        onClick={(event) => {
          event.preventDefault();
          adjustedOffset.current.x = 100;
          adjustedOffset.current.y = 100;
          // console.log(adjustedOffset.current);
          // startPan({ x: 0, y: 0 });
        }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        className="hover:cursor-pointer z-50 py-1 px-3 rounded border block m-2 bg-gray-900 absolute "
        style={{ zIndex: 1000 }}
      >
        Pan To!
      </button>
      {!props.hideData && (
        <dl className="w-64 font-mono grid grid-cols-2 absolute bottom-2 left-2">
          <dt>Offset</dt>
          <dd className="inline-block">
            {JSON.stringify(roundValues(offset))}
          </dd>
          <dt>Adj. Offset</dt>
          <dd className="inline-block">
            {JSON.stringify(roundValues(adjustedOffset.current))}
          </dd>
          <dt>Scale</dt>
          <dd>{round(scale)}</dd>
          <dt>Buffer</dt>
          <dd>{JSON.stringify(roundValues(buffer))}</dd>
        </dl>
      )}
    </div>
  );
};
