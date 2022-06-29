// from https://github.com/Roschl/react-leaflet-custom-layer-control-ts/tree/main/src

import { LeafletProvider, useLeafletContext } from '@react-leaflet/core';
import { Layer } from 'leaflet';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ReactNode } from 'react';
import { useLayerControlContext } from './layerControlContext';
import { useMap } from 'react-leaflet';

interface IProps {
  checked?: boolean;
  name: string;
  group: string;
  children: ReactNode[] | ReactNode;
  icon?: JSX.Element;
}

const createControlledLayer = (
  addLayerToControl: (
    layerContext: any,
    layer: Layer,
    name: string,
    group: string,
    icon?: JSX.Element
  ) => any
) => {
  const ControlledLayer = (props: IProps) => {
    const context = useLeafletContext();
    const layerContext = useLayerControlContext();
    const propsRef = useRef(props);
    //console.log('propsRef.Icon', propsRef.current.icon)
    const parentMap = useMap();

    const [layer, setLayer] = useState<Layer | null>(null);
    //console.log('layer', layer)

    const addLayer = useCallback(
      (layerToAdd) => {
        if (propsRef.current.checked) {
          parentMap.addLayer(layerToAdd);
        }

        addLayerToControl(
          layerContext,
          layerToAdd,
          propsRef.current.name,
          propsRef.current.group,
          propsRef.current.icon
        );
        setLayer(layerToAdd);
      },
      [context]
    );

    const removeLayer = useCallback(
      (layerToRemove) => {
        context.layersControl?.removeLayer(layerToRemove);
        setLayer(null);
      },
      [context]
    );

    const newContext = useMemo(() => {
      return context
        ? Object.assign({}, context, {
            layerContainer: {
              addLayer,
              removeLayer,
            },
          })
        : null;
    }, [context, addLayer, removeLayer]);

    useEffect(() => {
      if (layer !== null && propsRef.current !== props) {
        if (
          props.checked === true &&
          (propsRef.current.checked == null ||
            propsRef.current.checked === false)
        ) {
          parentMap.addLayer(layer);
        } else if (
          propsRef.current.checked === true &&
          (props.checked == null || props.checked === false)
        ) {
          parentMap.removeLayer(layer);
        }

        propsRef.current = props;
      }

      return () => {
        if (layer !== null) {
          context.layersControl = context.layersControl?.removeLayer(layer);
        }
      };
    });

    return props.children
      ? React.createElement(
          LeafletProvider,
          {
            value: newContext,
          },
          props.children
        )
      : null;
  };

  return ControlledLayer;
};

export default createControlledLayer;
