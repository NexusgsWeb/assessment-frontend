import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';


interface elements {
  name: string;
  children?: elements[];
}

const TREE_DATA: elements[] = [
  {
    name: 'Subjects',
    children: [
      { name: 'Subject 1'  },
      { name: 'Subject 2'  },
      { name: 'Subject 3'  },
      { name: 'Subject 4'  },
      { name: 'Subject 5'  },
      { name: 'Subject 6'  },
    ]
  }, {
    name: 'Classes',
    children: [
      { name: 'Class 1'  },
      { name: 'Class 2'  },
      { name: 'Class 3'  },
      { name: 'Class 4'  },
      { name: 'Class 5'  },
      { name: 'Class 6'  },
    ]
  },
];

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-element-tree',
  templateUrl: './element-tree.component.html',
  styleUrls: ['./element-tree.component.css']
})
export class ElementTreeComponent {
  
  @Output() onFilterClick = new EventEmitter<any>();
  private _transformer = (node: elements, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }
  pushNodeName(name:string){
    this.onFilterClick.emit(name);
  }
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;
}